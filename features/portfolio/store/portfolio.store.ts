import { create } from 'zustand';

export interface Holding {
  ticker: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalCost: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  fee?: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface PortfolioMetrics {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayGainLoss: number;
  dayGainLossPercent: number;
  allocation: Record<string, number>;
  topGainers: Holding[];
  topLosers: Holding[];
  holdingsCount: number;
  cash: number;
}

interface PortfolioStore {
  holdings: Record<string, Holding>;
  transactions: Transaction[];
  cash: number;
  totalValue: number;
  metrics: PortfolioMetrics | null;
  isLoading: boolean;
  lastUpdated: number | null;

  setHoldings: (holdings: Record<string, Holding>) => void;
  addHolding: (holding: Holding) => void;
  updateHolding: (ticker: string, updates: Partial<Holding>) => void;
  removeHolding: (ticker: string) => void;
  setCash: (amount: number) => void;
  setTotalValue: (value: number) => void;
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setMetrics: (metrics: PortfolioMetrics) => void;
  setIsLoading: (loading: boolean) => void;
  clearPortfolio: () => void;
  syncPortfolio: (data: any) => void;
  getMetrics: () => any;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  holdings: {},
  transactions: [],
  cash: 0,
  totalValue: 0,
  metrics: null,
  isLoading: false,
  lastUpdated: null,

  setHoldings: (holdings) => set({ holdings }),

  addHolding: (holding) =>
    set((state) => ({
      holdings: {
        ...state.holdings,
        [holding.ticker]: holding,
      },
    })),

  updateHolding: (ticker, updates) =>
    set((state) => ({
      holdings: {
        ...state.holdings,
        [ticker]: {
          ...state.holdings[ticker],
          ...updates,
        },
      },
    })),

  removeHolding: (ticker) =>
    set((state) => {
      const { [ticker]: _, ...remaining } = state.holdings;
      return { holdings: remaining };
    }),

  setCash: (amount) => set({ cash: amount }),

  setTotalValue: (value) => set({ totalValue: value }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  setTransactions: (transactions) => set({ transactions }),

  setMetrics: (metrics) => set({ metrics }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  clearPortfolio: () =>
    set({
      holdings: {},
      transactions: [],
      cash: 0,
      totalValue: 0,
      metrics: null,
      isLoading: false,
      lastUpdated: null,
    }),

  syncPortfolio: (data) =>
    set({
      holdings: data.holdings || {},
      cash: data.cash || 0,
      totalValue: data.totalValue || 0,
      lastUpdated: Date.now(),
    }),

  getMetrics: () => {
    const state = get();
    const holdings = Object.values(state.holdings);

    const investedValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalGainLoss = holdings.reduce((sum, h) => sum + h.gainLoss, 0);
    const totalGainLossPercent =
      investedValue > 0 ? (totalGainLoss / investedValue) * 100 : 0;

    // Calculate allocation percentages
    const allocation: Record<string, number> = {};
    holdings.forEach((holding) => {
      allocation[holding.ticker] =
        state.totalValue > 0 ? (holding.totalValue / state.totalValue) * 100 : 0;
    });

    return {
      totalValue: state.totalValue,
      cash: state.cash,
      investedValue,
      totalGainLoss,
      totalGainLossPercent,
      allocation,
    };
  },
}));
