import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '@controllers/authController';
import { authenticate } from '@middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  authController.register
);

/**
 * POST /api/auth/login
 * User login
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
router.post(
  '/refresh-token',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  authController.refreshToken
);

/**
 * POST /api/auth/verify-otp
 * Verify email with OTP
 */
router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  authController.verifyOtp
);

/**
 * GET /api/auth/me
 * Get current user (Protected)
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout user (Protected)
 */
router.post('/logout', authenticate, authController.logout);

export default router;
