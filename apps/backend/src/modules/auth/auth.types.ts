/**
 * TypeScript types and interfaces for authentication module
 */

import { Request } from 'express';
import { User } from '@prisma/client';

// Request body types
export interface RegisterRequestBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface LogoutRequestBody {
  refreshToken: string;
}

// Response types
export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  user: PublicUser;
}

// Public user (without password)
export type PublicUser = Omit<User, 'password'>;

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Authenticated Request (Express request with user)
export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}

// Token pair
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
