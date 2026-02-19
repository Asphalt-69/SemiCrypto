import ApiClient from './api';
import { API_ENDPOINTS } from '@/constants/api';
import { User, LoginPayload, RegisterPayload, OtpVerifyPayload, AuthToken } from '@/types/global.types';

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  userId: string;
  message: string;
  email: string;
}

class AuthService {
  /**
   * User login with email and password
   */
  static async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await ApiClient.request<LoginResponse>(
        'POST',
        API_ENDPOINTS.AUTH.LOGIN,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * User registration
   */
  static async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await ApiClient.request<RegisterResponse>(
        'POST',
        API_ENDPOINTS.AUTH.REGISTER,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOtp(payload: OtpVerifyPayload): Promise<LoginResponse> {
    try {
      const response = await ApiClient.request<LoginResponse>(
        'POST',
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  static async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await ApiClient.request<{ message: string }>(
        'POST',
        API_ENDPOINTS.AUTH.RESEND_OTP,
        { email }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const response = await ApiClient.request<AuthToken>(
        'POST',
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout
   */
  static async logout(): Promise<{ message: string }> {
    try {
      const response = await ApiClient.request<{ message: string }>(
        'POST',
        API_ENDPOINTS.AUTH.LOGOUT,
        {}
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
