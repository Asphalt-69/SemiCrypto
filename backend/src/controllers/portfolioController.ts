import { Response } from 'express';
import Portfolio from '@models/Portfolio';
import Order from '@models/Order';
import { AppError, asyncHandler, AuthenticatedRequest } from '@middleware/errorHandler';

/**
 * Get Portfolio Overview
 * GET /api/portfolio
 */
export const getPortfolioOverview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const portfolio = await Portfolio.findOne({ userId: req.userId });
  if (!portfolio) {
    throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
  }

  // Calculate metrics
  const investedValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalGainLoss = portfolio.holdings.reduce((sum, h) => sum + h.gainLoss, 0);
  const totalGainLossPercent = investedValue > 0 ? (totalGainLoss / investedValue) * 100 : 0;

  res.json({
    success: true,
    data: {
      portfolio: {
        id: portfolio._id,
        cash: portfolio.cash,
        totalValue: portfolio.totalValue,
        investedValue,
        totalGainLoss,
        totalGainLossPercent,
        holdingsCount: portfolio.holdings.length,
        holdings: portfolio.holdings,
      },
    },
  });
});

/**
 * Get Portfolio Holdings
 * GET /api/portfolio/holdings
 */
export const getHoldings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const portfolio = await Portfolio.findOne({ userId: req.userId });
  if (!portfolio) {
    throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      holdings: portfolio.holdings,
      count: portfolio.holdings.length,
    },
  });
});

/**
 * Get Portfolio Transactions/History
 * GET /api/portfolio/transactions
 */
export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { limit = '50', offset = '0', type } = req.query;

  const query: any = { userId: req.userId };
  if (type) {
    query.type = type;
  }

  const transactions = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string))
    .skip(parseInt(offset as string));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      transactions,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
  });
});

/**
 * Get Portfolio Metrics/Analysis
 * GET /api/portfolio/metrics
 */
export const getMetrics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const portfolio = await Portfolio.findOne({ userId: req.userId });
  if (!portfolio) {
    throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
  }

  // Calculate allocation percentages
  const allocation: Record<string, number> = {};
  portfolio.holdings.forEach((holding) => {
    allocation[holding.ticker] =
      portfolio.totalValue > 0 ? (holding.totalValue / portfolio.totalValue) * 100 : 0;
  });

  // Find top gainers and losers
  const topGainers = [...portfolio.holdings]
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    .slice(0, 5);

  const topLosers = [...portfolio.holdings]
    .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
    .slice(0, 5);

  const totalGainLoss = portfolio.holdings.reduce((sum, h) => sum + h.gainLoss, 0);
  const investedValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalGainLossPercent = investedValue > 0 ? (totalGainLoss / investedValue) * 100 : 0;

  res.json({
    success: true,
    data: {
      metrics: {
        totalValue: portfolio.totalValue,
        cash: portfolio.cash,
        investedValue,
        totalGainLoss,
        totalGainLossPercent,
        allocation,
        topGainers,
        topLosers,
      },
    },
  });
});

/**
 * Update Portfolio (Admin/System)
 * PUT /api/portfolio/update
 */
export const updatePortfolio = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { holdings, cash } = req.body;

  const portfolio = await Portfolio.findOne({ userId: req.userId });
  if (!portfolio) {
    throw new AppError('Portfolio not found', 404, 'PORTFOLIO_NOT_FOUND');
  }

  if (holdings) {
    portfolio.holdings = holdings;
  }
  if (cash !== undefined) {
    portfolio.cash = cash;
  }

  portfolio.totalValue = portfolio.cash + portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0);
  await portfolio.save();

  res.json({
    success: true,
    message: 'Portfolio updated successfully',
    data: {
      portfolio,
    },
  });
});
