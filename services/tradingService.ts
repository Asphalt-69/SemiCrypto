import ApiClient from './api';
import { API_ENDPOINTS } from '@/constants/api';
import { Stock, Order } from '@/features/trading/store/trading.store';

export interface OHLCData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SearchStocksResponse {
  stocks: Stock[];
  total: number;
}

interface PriceResponse {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

interface OHLCResponse {
  data: OHLCData[];
  ticker: string;
  timeframe: string;
}

interface OrderResponse {
  orderId: string;
  status: string;
  shares: number;
  price: number;
  ticker: string;
  createdAt: string;
}

interface OrderHistoryResponse {
  orders: Order[];
  total: number;
}

class TradingService {
  /**
   * Search for stocks
   */
  static async searchStocks(query: string, limit: number = 10): Promise<Stock[]> {
    try {
      const response = await ApiClient.request<SearchStocksResponse>(
        'GET',
        `${API_ENDPOINTS.TRADING.SEARCH_STOCKS}?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      return response.stocks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get stock details
   */
  static async getStock(ticker: string): Promise<Stock> {
    try {
      const response = await ApiClient.request<Stock>(
        'GET',
        API_ENDPOINTS.TRADING.GET_STOCK.replace('{ticker}', ticker)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current stock price
   */
  static async getPrice(ticker: string): Promise<PriceResponse> {
    try {
      const response = await ApiClient.request<PriceResponse>(
        'GET',
        API_ENDPOINTS.TRADING.GET_PRICE.replace('{ticker}', ticker)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get OHLC data for chart
   */
  static async getOHLC(
    ticker: string,
    timeframe: string = '1D',
    limit: number = 100,
    offset: number = 0
  ): Promise<OHLCData[]> {
    try {
      const response = await ApiClient.request<OHLCResponse>(
        'GET',
        `${API_ENDPOINTS.TRADING.GET_OHLC.replace('{ticker}', ticker)}?timeframe=${timeframe}&limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Place a buy/sell order
   */
  static async placeOrder(order: {
    ticker: string;
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT' | 'STOP';
    shares: number;
    limitPrice?: number;
  }): Promise<OrderResponse> {
    try {
      const response = await ApiClient.request<OrderResponse>(
        'POST',
        API_ENDPOINTS.TRADING.CREATE_ORDER,
        order
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order history
   */
  static async getOrderHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<Order[]> {
    try {
      const response = await ApiClient.request<OrderHistoryResponse>(
        'GET',
        `${API_ENDPOINTS.TRADING.GET_ORDER_HISTORY}?limit=${limit}&offset=${offset}`
      );
      return response.orders;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId: string): Promise<{ message: string }> {
    try {
      const response = await ApiClient.request<{ message: string }>(
        'POST',
        API_ENDPOINTS.TRADING.CANCEL_ORDER.replace('{orderId}', orderId),
        {}
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default TradingService;
