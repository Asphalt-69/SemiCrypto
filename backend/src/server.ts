import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import tradingRoutes from './routes/trading';
import portfolioRoutes from './routes/portfolio';
import chatRoutes from './routes/chat';

const app: Application = express();

/**
 * Middleware Setup
 */

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.app.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware (in development)
if (config.app.env === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/chat', chatRoutes);

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.env,
  });
});

/**
 * Error Handling
 */

// 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Server Startup
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const port = config.app.port;
    const server = app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║    🚀 SemiCrypto Backend API                          ║
║    Environment: ${config.app.env.toUpperCase().padEnd(23)}║
║    Port: ${port.toString().padEnd(35)}║
║    API URL: ${config.app.apiUrl.padEnd(26)}║
║                                                        ║
║    📚 API Documentation available at:                 ║
║       ${config.app.apiUrl}/api/docs                       ║
║                                                        ║
║    🏥 Health Check:                                   ║
║       ${config.app.apiUrl}/health                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n📮 SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n📮 SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start server if this is the main module
if (require.main === module) {
  startServer();
}

export default app;
