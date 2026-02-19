import { Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '@models/User';
import Portfolio from '@models/Portfolio';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '@middleware/auth';
import { AppError, asyncHandler, AuthenticatedRequest } from '@middleware/errorHandler';

/**
 * User Registration
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors.array());
  }

  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  // Create portfolio for user
  await Portfolio.create({
    userId: user._id,
  });

  const accessToken = generateToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Store refresh token
  user.refreshTokens = [refreshToken];
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

/**
 * User Login
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors.array());
  }

  const { email, password } = req.body;

  // Find user and check password
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check if account is active
  if (user.accountStatus !== 'ACTIVE') {
    throw new AppError(`Account is ${user.accountStatus.toLowerCase()}`, 403, 'ACCOUNT_INACTIVE');
  }

  // Generate tokens
  const accessToken = generateToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Update refresh tokens and last login
  user.refreshTokens.push(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

/**
 * Refresh Access Token
 * POST /api/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN');
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.refreshTokens.includes(token)) {
    throw new AppError('Refresh token not found', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Generate new tokens
  const newAccessToken = generateToken(user._id.toString(), user.email);
  const newRefreshToken = generateRefreshToken(user._id.toString());

  // Update refresh tokens
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    },
  });
});

/**
 * Verify OTP (Placeholder for email verification)
 * POST /api/auth/verify-otp
 */
export const verifyOtp = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // In production, verify against sent OTP
  // For now, we'll mark as verified if OTP is "123456"
  if (otp !== '123456') {
    throw new AppError('Invalid OTP', 400, 'INVALID_OTP');
  }

  user.isEmailVerified = true;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        preferences: user.preferences,
        kycStatus: user.kycStatus,
      },
    },
  });
});

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken: token } = req.body;

  if (token && req.userId) {
    const user = await User.findById(req.userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user.save();
    }
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});
