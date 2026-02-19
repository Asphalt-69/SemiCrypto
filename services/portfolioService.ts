import ApiClient from './api';
import { API_ENDPOINTS } from '@/constants/api';
import { Holding, Transaction, PortfolioMetrics } from '@/features/portfolio/store/portfolio.store';

interface PortfolioOverviewResponse {
  holdings: Record<string, Holding>;
  cash: number;
  totalValue: number;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

class PortfolioService {
  /**
   * Get portfolio overview
   */
  static async getPortfolioOverview(): Promise<PortfolioOverviewResponse> {
    try {
      const response = await ApiClient.request<PortfolioOverviewResponse>(
        'GET',
        API_ENDPOINTS.PORTFOLIO.GET_OVERVIEW
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all transactions
   */
  static async getTransactions(
    limit: number = 50,
    offset: number = 0,
    type?: 'BUY' | 'SELL'
  ): Promise<Transaction[]> {
    try {
      const url = `${API_ENDPOINTS.PORTFOLIO.GET_TRANSACTIONS}?limit=${limit}&offset=${offset}${
        type ? `&type=${type}` : ''
      }`;
      const response = await ApiClient.request<TransactionsResponse>('GET', url);
      return response.transactions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get portfolio metrics (gains, allocation, etc.)
   */
  static async getMetrics(): Promise<PortfolioMetrics> {
    try {
      const response = await ApiClient.request<PortfolioMetrics>(
        'GET',
        API_ENDPOINTS.PORTFOLIO.GET_METRICS
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default PortfolioService;
