const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value;
};

export const env = {
  // Backend
  BACKEND_URL: getEnvVar('NEXT_PUBLIC_BACKEND_URL'),
  
  // APIs
  STOCK_API_KEY: getEnvVar('NEXT_PUBLIC_STOCK_API_KEY'),
  GOOGLE_CLIENT_ID: getEnvVar('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
  
  // WebSocket
  WS_URL: getEnvVar('NEXT_PUBLIC_WS_URL'),
  
  // Environment
  ENV: getEnvVar('NEXT_PUBLIC_ENV') || 'development',
  
  isDevelopment: process.env.NEXT_PUBLIC_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
};

// Validate required vars on startup
if (typeof window === 'undefined') {
  // Server-side only
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    console.warn('NEXT_PUBLIC_BACKEND_URL is not set');
  }
}
