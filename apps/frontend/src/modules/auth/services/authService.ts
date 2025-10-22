/**
 * Authentication Service
 * Handles all API calls for authentication
 */

import axios, { AxiosInstance } from 'axios';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RefreshTokenResponse,
  CurrentUserResponse,
  RefreshTokenRequest,
  LogoutRequest,
} from '../types/auth.types';

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ============================================================================
// Auth Service
// ============================================================================

export const authService = {
  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/register',
      credentials
    );
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(refreshToken: string): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    const requestData: LogoutRequest = { refreshToken };

    await apiClient.post('/api/auth/logout', requestData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const requestData: RefreshTokenRequest = { refreshToken };

    const response = await apiClient.post<RefreshTokenResponse>(
      '/api/auth/refresh',
      requestData
    );
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await apiClient.get<CurrentUserResponse>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};

// Export axios instance for interceptors
export { apiClient };
