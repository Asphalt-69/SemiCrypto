import { Response } from 'express';
import { validationResult } from 'express-validator';
import Order, { IOrder } from '@models/Order';
import Stock from '@models/Stock';
import Portfolio from '@models/Portfolio';
import { AppError, asyncHandler, AuthenticatedRequest } from '@middleware/errorHandler';

/**
 * Search Stocks/Assets
 * GET /api/trading/search?query=BTC
 */
export const searchStocks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { query, type } = req.query;

  if (!query) {
    throw new AppError('Search query is required', 400, 'MISSING_QUERY');
  }

  const searchQuery: any = {
    $or: [
      { ticker: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } },
    ],
  };

  if (type) {
    searchQuery.type = type;
  }

  const stocks = await Stock.find(searchQuery).limit(10);

  res.json({
    success: true,
    data: {
      results: stocks,
      count: stocks.length,
    },
  });
});

/**
 * Get Stock Details
 * GET /api/trading/stocks/:ticker
 */
export const getStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { ticker } = req.params;

  const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });
  if (!stock) {
    throw new AppError('Stock not found', 404, 'STOCK_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      stock,
    },
  });
});

/**
 * Place Order (Buy/Sell)
 * POST /api/trading/orders
 */
export const placeOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors.array());
  }

  const { ticker, type, quantity, price, orderType } = req.body;

  // Verify stock exists
  const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });
  if (!stock) {
    throw new AppError('Stock not found', 404, 'STOCK_NOT_FOUND');
  }

  // Get user portfolio
  const portfolio = await Portfolio.findOne({ userId: req.userId });
  if (!portfolio) {
    throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
  }

  // Calculate order details
  const total = quantity * price;
  const fee = total * 0.001; // 0.1% trading fee

  // Validate sufficient cash for buy orders
  if (type === 'BUY' && portfolio.cash < total + fee) {
    throw new AppError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
  }

  // Create order
  const order = await Order.create({
    userId: req.userId,
    ticker: ticker.toUpperCase(),
    type,
    quantity,
    price,
    total,
    orderType: orderType || 'MARKET',
    fee,
    status: 'FILLED', // Simplified - in production, would be PENDING until filled
    filledQuantity: quantity,
    averageFillPrice: price,
    executedAt: new Date(),
  });

  // Update portfolio
  if (type === 'BUY') {
    // Add to holdings or update existing
    const holding = portfolio.holdings.find((h) => h.ticker === ticker.toUpperCase());
    if (holding) {
      holding.quantity += quantity;
      holding.averageCost =
        (holding.averageCost * (holding.quantity - quantity) + price * quantity) / holding.quantity;
    } else {
      portfolio.holdings.push({
        ticker: ticker.toUpperCase(),
        quantity,
        averageCost: price,
        currentPrice: stock.currentPrice,
        totalValue: quantity * stock.currentPrice,
        gainLoss: 0,
        gainLossPercent: 0,
        lastUpdated: new Date(),
      });
    }
    portfolio.cash -= total + fee;
  } else {
    // Sell order
    const holding = portfolio.holdings.find((h) => h.ticker === ticker.toUpperCase());
    if (!holding || holding.quantity < quantity) {
      throw new AppError('Insufficient holdings', 400, 'INSUFFICIENT_HOLDINGS');
    }
    holding.quantity -= quantity;
    portfolio.cash += total - fee;

    // Remove holding if quantity is 0
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.ticker !== ticker.toUpperCase());
    }
  }

  portfolio.totalValue = portfolio.cash + portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
  await portfolio.save();

  res.status(201).json({
    success: true,
    message: `${type} order placed successfully`,
    data: {
      order,
    },
  });
});

/**
 * Get Order History
 * GET /api/trading/orders
 */
export const getOrderHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, limit = '20', offset = '0' } = req.query;

  const query: any = { userId: req.userId };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string))
    .skip(parseInt(offset as string));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
  });
});

/**
 * Cancel Order
 * PUT /api/trading/orders/:orderId/cancel
 */
export const cancelOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order || order.userId.toString() !== req.userId) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  if (!['PENDING', 'PARTIALLY_FILLED'].includes(order.status)) {
    throw new AppError('Cannot cancel this order', 400, 'INVALID_ORDER_STATUS');
  }

  order.status = 'CANCELLED';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      order,
    },
  });
});
