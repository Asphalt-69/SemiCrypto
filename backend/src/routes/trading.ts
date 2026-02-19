import { Router } from 'express';
import { body, query } from 'express-validator';
import * as tradingController from '@controllers/tradingController';
import { authenticate } from '@middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/trading/search?query=BTC&type=CRYPTO
 * Search stocks/assets
 */
router.get('/search', tradingController.searchStocks);

/**
 * GET /api/trading/stocks/:ticker
 * Get stock details
 */
router.get('/stocks/:ticker', tradingController.getStock);

/**
 * POST /api/trading/orders
 * Place new order
 */
router.post(
  '/orders',
  [
    body('ticker').isString().trim().notEmpty().withMessage('Ticker is required'),
    body('type')
      .isIn(['BUY', 'SELL'])
      .withMessage('Type must be BUY or SELL'),
    body('quantity')
      .isFloat({ min: 0.0001 })
      .withMessage('Quantity must be greater than 0'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be valid'),
    body('orderType')
      .optional()
      .isIn(['MARKET', 'LIMIT', 'STOP'])
      .withMessage('Order type must be MARKET, LIMIT, or STOP'),
  ],
  tradingController.placeOrder
);

/**
 * GET /api/trading/orders
 * Get order history
 */
router.get(
  '/orders',
  [
    query('status').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  tradingController.getOrderHistory
);

/**
 * PUT /api/trading/orders/:orderId/cancel
 * Cancel order
 */
router.put('/orders/:orderId/cancel', tradingController.cancelOrder);

export default router;
