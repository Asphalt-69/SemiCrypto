export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  // Trading
  TRADING: {
    SEARCH_STOCKS: '/stocks/search',
    GET_STOCK: '/stocks/{ticker}',
    GET_PRICE: '/stocks/{ticker}/price',
    GET_OHLC: '/stocks/{ticker}/ohlc',
    CREATE_ORDER: '/orders/create',
    GET_ORDER_HISTORY: '/orders/history',
    CANCEL_ORDER: '/orders/{orderId}/cancel',
  },
  
  // Portfolio
  PORTFOLIO: {
    GET_OVERVIEW: '/portfolio/overview',
    GET_TRANSACTIONS: '/portfolio/transactions',
    GET_METRICS: '/portfolio/metrics',
  },
  
  // Chat
  CHAT: {
    GET_MESSAGES: '/chat/messages/{userId}',
    SEND_MESSAGE: '/chat/message',
    GET_USERS: '/chat/users',
    TYPING_STATUS: '/chat/typing-status',
  },
};

export const API_TIMEOUTS = {
  DEFAULT: 30000,
  SHORT: 10000,
  LONG: 60000,
};

export const API_RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_MULTIPLIER: 2,
};

export const POLLING_INTERVALS = {
  PRICE_UPDATE: 5000, // 5 seconds
  PORTFOLIO_UPDATE: 30000, // 30 seconds
  MARKET_DATA: 10000, // 10 seconds
};

export const CHART_SETTINGS = {
  DEFAULT_TIMEFRAME: '1D' as const,
  TIMEFRAMES: ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const,
  CANDLES_PER_REQUEST: 100,
  DEFAULT_HEIGHT: 400,
};

export const REQUEST_DEDUPLICATION_TTL = 5000; // 5 seconds
