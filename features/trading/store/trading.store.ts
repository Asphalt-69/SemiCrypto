import { create } from 'zustand';

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  week52High?: number;
  week52Low?: number;
}

export interface Order {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  shares: number;
  price: number;
  limitPrice?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'FAILED';
  createdAt: string;
  updatedAt?: string;
}

interface TradingStore {
  selectedStock: Stock | null;
  watchlist: string[];
  pendingOrders: Record<string, Order>;
  executionHistory: Order[];
  selectedTimeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL';

  selectStock: (stock: Stock | null) => void;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  isInWatchlist: (ticker: string) => boolean;
  addPendingOrder: (order: Order) => void;
  removePendingOrder: (orderId: string) => void;
  addToExecutionHistory: (order: Order) => void;
  setSelectedTimeframe: (timeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL') => void;
  clearTradingState: () => void;
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  selectedStock: null,
  watchlist: [],
  pendingOrders: {},
  executionHistory: [],
  selectedTimeframe: '1D',

  selectStock: (stock) => set({ selectedStock: stock }),

  addToWatchlist: (ticker) =>
    set((state) => {
      if (!state.watchlist.includes(ticker)) {
        return { watchlist: [...state.watchlist, ticker] };
      }
      return state;
    }),

  removeFromWatchlist: (ticker) =>
    set((state) => ({
      watchlist: state.watchlist.filter((t) => t !== ticker),
    })),

  isInWatchlist: (ticker) => get().watchlist.includes(ticker),

  addPendingOrder: (order) =>
    set((state) => ({
      pendingOrders: {
        ...state.pendingOrders,
        [order.id]: order,
      },
    })),

  removePendingOrder: (orderId) =>
    set((state) => {
      const { [orderId]: _, ...remaining } = state.pendingOrders;
      return { pendingOrders: remaining };
    }),

  addToExecutionHistory: (order) =>
    set((state) => ({
      executionHistory: [order, ...state.executionHistory],
    })),

  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),

  clearTradingState: () =>
    set({
      selectedStock: null,
      watchlist: [],
      pendingOrders: {},
      executionHistory: [],
      selectedTimeframe: '1D',
    }),
}));
