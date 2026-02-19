import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface Config {
  app: {
    env: 'development' | 'production' | 'test';
    port: number;
    apiUrl: string;
    frontendUrl: string;
  };
  database: {
    mongoUri: string;
    dbName: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiry: string;
    refreshTokenSecret: string;
    refreshTokenExpiry: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    emailFrom: string;
  };
  encryption: {
    encryptionKey: string;
  };
  thirdParty: {
    stockApiKey: string;
    cryptoApiKey: string;
  };
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
  };
}

const getConfig = (): Config => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
  ];

  // Validate required env vars
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
    console.warn('Please check your .env.local file');
  }

  return {
    app: {
      env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      port: parseInt(process.env.PORT || '5000', 10),
      apiUrl: process.env.API_URL || 'http://localhost:5000',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    database: {
      mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/semicrypto',
      dbName: process.env.DB_NAME || 'semicrypto',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_key_should_be_overridden',
      jwtExpiry: process.env.JWT_EXPIRY || '7d',
      refreshTokenSecret:
        process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_should_be_overridden',
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '30d',
    },
    email: {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS || '',
      emailFrom: process.env.EMAIL_FROM || 'noreply@semicrypto.com',
    },
    encryption: {
      encryptionKey: process.env.ENCRYPTION_KEY || 'default_encryption_key_32_characters_min',
    },
    thirdParty: {
      stockApiKey: process.env.STOCK_API_KEY || '',
      cryptoApiKey: process.env.CRYPTO_API_KEY || '',
    },
    logging: {
      level: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
    },
  };
};

export const config = getConfig();

export default config;
