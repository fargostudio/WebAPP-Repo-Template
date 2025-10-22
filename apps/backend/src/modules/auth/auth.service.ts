/**
 * Authentication Service
 * Business logic for user authentication
 */

import { PrismaClient, User } from '@prisma/client';
import {
  AuthResponse,
  PublicUser,
  RefreshResponse,
  RegisterRequestBody,
  LoginRequestBody,
  TokenPair,
  JwtPayload,
} from './auth.types.js';
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  verifyRefreshToken,
  parseExpiration,
  JWT_REFRESH_EXPIRES_IN,
} from './auth.utils.js';
import { logger } from '../../utils/logger.js';

const prisma = new PrismaClient();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Remove password from user object
 */
function excludePassword(user: User): PublicUser {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Store refresh token in database
 */
async function storeRefreshToken(
  userId: string,
  refreshToken: string
): Promise<void> {
  try {
    const expiresAt = parseExpiration(JWT_REFRESH_EXPIRES_IN());

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    logger.info(`Refresh token stored for user ${userId}`);
  } catch (error) {
    logger.error('Error storing refresh token', error);
    throw new Error('Failed to store refresh token');
  }
}

/**
 * Delete refresh token from database
 */
async function deleteRefreshToken(token: string): Promise<void> {
  try {
    await prisma.refreshToken.delete({
      where: { token },
    });

    logger.info('Refresh token deleted');
  } catch (error) {
    logger.error('Error deleting refresh token', error);
    // Don't throw error if token not found
  }
}

/**
 * Clean up expired refresh tokens for a user
 */
async function cleanupExpiredTokens(userId: string): Promise<void> {
  try {
    const deleted = await prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (deleted.count > 0) {
      logger.info(`Cleaned up ${deleted.count} expired tokens for user ${userId}`);
    }
  } catch (error) {
    logger.error('Error cleaning up expired tokens', error);
  }
}

// ============================================================================
// Authentication Service
// ============================================================================

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequestBody): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name || null,
        },
      });

      logger.info(`User registered: ${user.email}`);

      // Generate tokens
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };
      const tokens = generateTokenPair(tokenPayload);

      // Store refresh token
      await storeRefreshToken(user.id, tokens.refreshToken);

      // Return user without password
      const publicUser = excludePassword(user);

      return {
        user: publicUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error('Error in register service', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginRequestBody): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is deactivated');
      }

      // Verify password
      const isPasswordValid = await comparePassword(data.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info(`User logged in: ${user.email}`);

      // Generate tokens
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };
      const tokens = generateTokenPair(tokenPayload);

      // Store refresh token
      await storeRefreshToken(user.id, tokens.refreshToken);

      // Clean up expired tokens
      await cleanupExpiredTokens(user.id);

      // Return user without password
      const publicUser = excludePassword(user);

      return {
        user: publicUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error('Error in login service', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await deleteRefreshToken(refreshToken);
        throw new Error('Refresh token expired');
      }

      // Check if user is still active
      if (!storedToken.user.isActive) {
        throw new Error('User account is deactivated');
      }

      logger.info(`Tokens refreshed for user: ${storedToken.user.email}`);

      // Generate new token pair
      const tokenPayload: JwtPayload = {
        userId: storedToken.user.id,
        email: storedToken.user.email,
      };
      const tokens = generateTokenPair(tokenPayload);

      // Delete old refresh token and store new one
      await deleteRefreshToken(refreshToken);
      await storeRefreshToken(storedToken.user.id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error('Error in refresh tokens service', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      await deleteRefreshToken(refreshToken);
      logger.info('User logged out');
    } catch (error) {
      logger.error('Error in logout service', error);
      throw error;
    }
  }

  /**
   * Get current user by ID
   */
  static async getCurrentUser(userId: string): Promise<PublicUser> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('User account is deactivated');
      }

      return excludePassword(user);
    } catch (error) {
      logger.error('Error in getCurrentUser service', error);
      throw error;
    }
  }

  /**
   * Get user by email (for testing/admin purposes)
   */
  static async getUserByEmail(email: string): Promise<PublicUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return user ? excludePassword(user) : null;
    } catch (error) {
      logger.error('Error in getUserByEmail service', error);
      throw error;
    }
  }
}
