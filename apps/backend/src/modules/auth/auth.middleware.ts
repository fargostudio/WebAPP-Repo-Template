/**
 * Authentication Middleware
 * Protects routes by verifying JWT access tokens
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.types.js';
import { verifyAccessToken, extractTokenFromHeader } from './auth.utils.js';
import { AuthService } from './auth.service.js';
import { logger } from '../../utils/logger.js';
import { ApiError } from '../../middleware/errorHandler.js';

/**
 * Middleware to authenticate requests using JWT
 *
 * Usage:
 * ```typescript
 * import { authenticate } from './modules/auth/auth.middleware';
 *
 * router.get('/protected', authenticate, handler);
 * ```
 *
 * The authenticated user will be available in `req.user`
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new ApiError(401, 'No authentication token provided');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Access token expired') {
          throw new ApiError(401, 'Access token expired');
        }
        if (error.message === 'Invalid access token') {
          throw new ApiError(401, 'Invalid access token');
        }
      }
      throw new ApiError(401, 'Failed to verify access token');
    }

    // Get user from database
    const user = await AuthService.getCurrentUser(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Attach user to request
    req.user = user;

    logger.info(`User authenticated: ${user.email}`);
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      logger.error('Error in authenticate middleware', error);
      next(new ApiError(401, 'Authentication failed'));
    }
  }
}

/**
 * Optional authentication middleware
 * Does not throw error if no token is provided
 * Useful for routes that work for both authenticated and anonymous users
 *
 * Usage:
 * ```typescript
 * router.get('/public-or-private', optionalAuthenticate, handler);
 *
 * // In handler:
 * if (req.user) {
 *   // User is authenticated
 * } else {
 *   // User is anonymous
 * }
 * ```
 */
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token, proceed as anonymous
      return next();
    }

    // Try to verify token
    try {
      const decoded = verifyAccessToken(token);
      const user = await AuthService.getCurrentUser(decoded.userId);

      if (user) {
        req.user = user;
        logger.info(`User optionally authenticated: ${user.email}`);
      }
    } catch (error) {
      // Token invalid/expired, proceed as anonymous
      logger.warn('Optional authentication failed, proceeding as anonymous');
    }

    next();
  } catch (error) {
    logger.error('Error in optionalAuthenticate middleware', error);
    next();
  }
}

/**
 * Middleware to check if user has specific email verification
 * Must be used after `authenticate` middleware
 *
 * Usage:
 * ```typescript
 * router.post('/verified-only', authenticate, requireEmailVerified, handler);
 * ```
 */
export function requireEmailVerified(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    if (!req.user.emailVerified) {
      throw new ApiError(403, 'Email not verified');
    }

    next();
  } catch (error) {
    next(error);
  }
}
