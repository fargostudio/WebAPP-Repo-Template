/**
 * Authentication Controller
 * Route handlers for authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import {
  AuthenticatedRequest,
  RegisterRequestBody,
  LoginRequestBody,
} from './auth.types.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from './auth.utils.js';
import { logger } from '../../utils/logger.js';
import { ApiError } from '../../middleware/errorHandler.js';

/**
 * Register a new user
 * POST /api/auth/register
 *
 * @body { email: string, password: string, name?: string }
 * @returns { user: PublicUser, accessToken: string, refreshToken: string }
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body) as RegisterRequestBody;

    // Call service
    const result = await AuthService.register(validatedData);

    logger.info(`User registered successfully: ${validatedData.email}`);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors[0].message));
    }

    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return next(new ApiError(409, error.message));
      }
    }

    logger.error('Error in register controller', error);
    next(new ApiError(500, 'Failed to register user'));
  }
}

/**
 * Login user
 * POST /api/auth/login
 *
 * @body { email: string, password: string }
 * @returns { user: PublicUser, accessToken: string, refreshToken: string }
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body) as LoginRequestBody;

    // Call service
    const result = await AuthService.login(validatedData);

    logger.info(`User logged in successfully: ${validatedData.email}`);

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors[0].message));
    }

    if (error instanceof Error) {
      if (
        error.message === 'Invalid email or password' ||
        error.message === 'User account is deactivated'
      ) {
        return next(new ApiError(401, error.message));
      }
    }

    logger.error('Error in login controller', error);
    next(new ApiError(500, 'Failed to login'));
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 *
 * @body { refreshToken: string }
 * @returns { accessToken: string, refreshToken: string }
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = refreshTokenSchema.parse(req.body);

    // Call service
    const result = await AuthService.refreshTokens(validatedData.refreshToken);

    logger.info('Tokens refreshed successfully');

    res.status(200).json({
      message: 'Tokens refreshed successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors[0].message));
    }

    if (error instanceof Error) {
      if (
        error.message === 'Invalid refresh token' ||
        error.message === 'Refresh token expired' ||
        error.message === 'User account is deactivated'
      ) {
        return next(new ApiError(401, error.message));
      }
    }

    logger.error('Error in refreshToken controller', error);
    next(new ApiError(500, 'Failed to refresh tokens'));
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 *
 * @headers Authorization: Bearer {accessToken}
 * @body { refreshToken: string }
 * @returns { message: string }
 */
export async function logout(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = logoutSchema.parse(req.body);

    // Call service
    await AuthService.logout(validatedData.refreshToken);

    logger.info('User logged out successfully');

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors[0].message));
    }

    logger.error('Error in logout controller', error);
    // Don't fail logout even if refresh token is invalid
    res.status(200).json({
      message: 'Logged out successfully',
    });
  }
}

/**
 * Get current user
 * GET /api/auth/me
 *
 * @headers Authorization: Bearer {accessToken}
 * @returns { user: PublicUser }
 */
export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    logger.error('Error in getCurrentUser controller', error);
    next(new ApiError(500, 'Failed to get current user'));
  }
}
