/**
 * Utility functions for authentication
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import { JwtPayload, TokenPair } from './auth.types.js';
import { logger } from '../../utils/logger.js';

// Constants
const SALT_ROUNDS = 10;

// Environment variables with validation
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const JWT_ACCESS_SECRET = () => getEnvVar('JWT_ACCESS_SECRET');
export const JWT_REFRESH_SECRET = () => getEnvVar('JWT_REFRESH_SECRET');
export const JWT_ACCESS_EXPIRES_IN = () => process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = () => process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ============================================================================
// Password Hashing
// ============================================================================

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    logger.error('Error hashing password', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    logger.error('Error comparing password', error);
    throw new Error('Failed to compare password');
  }
}

// ============================================================================
// JWT Token Generation
// ============================================================================

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: JwtPayload): string {
  try {
    const token = jwt.sign(payload, JWT_ACCESS_SECRET(), {
      expiresIn: JWT_ACCESS_EXPIRES_IN(),
    });
    return token;
  } catch (error) {
    logger.error('Error generating access token', error);
    throw new Error('Failed to generate access token');
  }
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: JwtPayload): string {
  try {
    const token = jwt.sign(payload, JWT_REFRESH_SECRET(), {
      expiresIn: JWT_REFRESH_EXPIRES_IN(),
    });
    return token;
  } catch (error) {
    logger.error('Error generating refresh token', error);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: JwtPayload): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Generate a random token string (for refresh token storage)
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ============================================================================
// JWT Token Verification
// ============================================================================

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET()) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    logger.error('Error verifying access token', error);
    throw new Error('Failed to verify access token');
  }
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET()) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    logger.error('Error verifying refresh token', error);
    throw new Error('Failed to verify refresh token');
  }
}

// ============================================================================
// Validation Schemas (Zod)
// ============================================================================

/**
 * Validation schema for user registration
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Validation schema for refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Validation schema for logout
 */
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate expiration date from JWT expiration string
 * @example parseExpiration('7d') => Date 7 days from now
 */
export function parseExpiration(expiresIn: string): Date {
  const now = new Date();
  const regex = /^(\d+)([smhd])$/;
  const match = expiresIn.match(regex);

  if (!match) {
    throw new Error(`Invalid expiration format: ${expiresIn}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'd':
      now.setDate(now.getDate() + value);
      break;
  }

  return now;
}

/**
 * Extract token from Authorization header
 * @example "Bearer abc123" => "abc123"
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
