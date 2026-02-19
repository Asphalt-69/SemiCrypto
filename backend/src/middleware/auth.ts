import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config/env';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'No token provided',
        details: 'Authorization header missing or invalid',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string; email: string };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        details: 'Please refresh your token',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
        details: 'Token verification failed',
      });
    }

    res.status(401).json({
      code: 'AUTHORIZATION_ERROR',
      message: 'Authorization failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiry,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.auth.refreshTokenSecret, {
    expiresIn: config.auth.refreshTokenExpiry,
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, config.auth.refreshTokenSecret) as { userId: string };
  } catch (error) {
    return null;
  }
};
