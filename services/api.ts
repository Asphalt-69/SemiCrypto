import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '@/lib/env';
import { API_RETRY_CONFIG, REQUEST_DEDUPLICATION_TTL } from '@/constants/api';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface RequestCacheEntry {
  promise: Promise<any>;
  timestamp: number;
}

class ApiClient {
  private static instance: AxiosInstance;
  private static requestCache: Map<string, RequestCacheEntry> = new Map();

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: env.BACKEND_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Request interceptor: add auth token
      this.instance.interceptors.request.use(
        (config) => {
          const authStore = useAuthStore.getState();
          if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor: handle errors and token refresh
      this.instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config as any;

          // Handle 401 - Token expired
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const authStore = useAuthStore.getState();
              if (authStore.refreshToken) {
                // Attempt token refresh (implement in authService)
                authStore.logout();
                window.location.href = '/login';
              }
            } catch (refreshError) {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }
          }

          return Promise.reject(this.normalizeError(error));
        }
      );
    }

    return this.instance;
  }

  /**
   * Deduplicate requests - return same promise for identical in-flight requests
   */
  static async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    const cacheKey = `${method}:${url}:${JSON.stringify(data || {})}`;
    const now = Date.now();

    // Check if identical request is already in flight
    const cached = this.requestCache.get(cacheKey);
    if (cached && now - cached.timestamp < REQUEST_DEDUPLICATION_TTL) {
      return cached.promise;
    }

    // Clear old cache entries
    this.requestCache.forEach((entry, key) => {
      if (now - entry.timestamp > REQUEST_DEDUPLICATION_TTL) {
        this.requestCache.delete(key);
      }
    });

    // Execute request with retry logic
    const promise = this.executeWithRetry<T>(method, url, data, config);
    this.requestCache.set(cacheKey, { promise, timestamp: now });

    return promise;
  }

  /**
   * Execute request with exponential backoff retry
   */
  private static async executeWithRetry<T>(
    method: string,
    url: string,
    data?: any,
    config?: any,
    attempt: number = 0
  ): Promise<T> {
    try {
      const instance = this.getInstance();
      const response = await instance({
        method,
        url,
        data,
        ...config,
      });

      return response.data;
    } catch (error: any) {
      const isRetryable =
        attempt < API_RETRY_CONFIG.MAX_RETRIES &&
        (error.response?.status >= 500 || error.code === 'ECONNABORTED');

      if (isRetryable) {
        const delay = Math.min(
          API_RETRY_CONFIG.INITIAL_DELAY *
            Math.pow(API_RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt) +
            Math.random() * 1000,
          API_RETRY_CONFIG.MAX_DELAY
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeWithRetry<T>(method, url, data, config, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Normalize API errors to consistent format
   */
  private static normalizeError(error: any): Error & { code?: string } {
    if (error.response) {
      const { status, data } = error.response;
      const normalizedError = new Error(
        data?.message || 'An error occurred'
      ) as Error & { code?: string };

      normalizedError.code = `HTTP_${status}`;

      if (status === 422) {
        // Validation error
        normalizedError.message = 'Validation failed';
        (normalizedError as any).details = data?.details;
      } else if (status === 401) {
        normalizedError.message = 'Unauthorized. Please login again.';
      } else if (status === 403) {
        normalizedError.message = 'You do not have permission to perform this action.';
      } else if (status >= 500) {
        normalizedError.message = 'Server error. Please try again later.';
      }

      return normalizedError;
    }

    if (error.request && !error.response) {
      const networkError = new Error(
        'Network error. Please check your connection.'
      ) as Error & { code?: string };
      networkError.code = 'NETWORK_ERROR';
      return networkError;
    }

    return error;
  }
}

export default ApiClient;
