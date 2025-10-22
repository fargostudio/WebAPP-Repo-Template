/**
 * Authentication Types for Frontend
 */

// User (matches backend PublicUser)
export interface User {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

// Auth Response (from backend)
export interface AuthResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response
export interface RefreshTokenResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Current user response
export interface CurrentUserResponse {
  message: string;
  data: {
    user: User;
  };
}

// Logout request
export interface LogoutRequest {
  refreshToken: string;
}

// Auth store state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth store actions
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}
