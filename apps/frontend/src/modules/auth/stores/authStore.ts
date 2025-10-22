/**
 * Authentication Store (Zustand)
 * Manages authentication state and actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth.types';
import { authService } from '../services/authService';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);
          const { user, accessToken, refreshToken } = response.data;

          // Save tokens to localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Login failed. Please try again.';

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(credentials);
          const { user, accessToken, refreshToken } = response.data;

          // Save tokens to localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            'Registration failed. Please try again.';

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();

        set({ isLoading: true });

        try {
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state and localStorage regardless of API call result
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshTokens: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          } = response.data;

          // Save new tokens
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          set({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          // Clear auth state on refresh failure
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });

          throw error;
        }
      },

      checkAuth: async () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true });

        try {
          // Try to get current user
          const response = await authService.getCurrentUser();
          const { user } = response.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // If getting user fails, try to refresh token
          if (error.response?.status === 401) {
            try {
              await get().refreshTokens();
              // Retry getting user
              const response = await authService.getCurrentUser();
              const { user } = response.data;

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (refreshError) {
              // Clear everything if refresh fails
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
