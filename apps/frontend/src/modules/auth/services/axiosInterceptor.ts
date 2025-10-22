/**
 * Axios Interceptor
 * Auto-attaches access token and handles token refresh
 */

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient, authService } from './authService';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Setup axios interceptors
 * Call this function in your app initialization (main.tsx or App.tsx)
 */
export function setupAxiosInterceptors() {
  // Request interceptor - attach access token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token refresh
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is not 401 or no original request, reject immediately
      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      // Avoid refresh loop for auth endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      // If already retried, reject
      if (originalRequest._retry) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh token
        const response = await authService.refreshToken(refreshToken);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Save new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }
  );
}
