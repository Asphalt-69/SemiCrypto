import { Router } from 'express';
import { query } from 'express-validator';
import * as portfolioController from '@controllers/portfolioController';
import { authenticate } from '@middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/portfolio
 * Get portfolio overview
 */
router.get('/', portfolioController.getPortfolioOverview);

/**
 * GET /api/portfolio/holdings
 * Get portfolio holdings
 */
router.get('/holdings', portfolioController.getHoldings);

/**
 * GET /api/portfolio/transactions
 * Get transaction history
 */
router.get(
  '/transactions',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    query('type').optional().isIn(['BUY', 'SELL']),
  ],
  portfolioController.getTransactions
);

/**
 * GET /api/portfolio/metrics
 * Get portfolio metrics and analysis
 */
router.get('/metrics', portfolioController.getMetrics);

/**
 * PUT /api/portfolio/update
 * Update portfolio (Admin/System)
 */
router.put('/update', portfolioController.updatePortfolio);

export default router;
