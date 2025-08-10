import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  totalValue: number
  fees: number
  executedAt: Date
  strategy?: string
  notes?: string
}

interface Portfolio {
  id: string
  name: string
  description?: string
  initialBalance: number
  currentBalance: number
  isActive: boolean
}

interface Position {
  id: string
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice?: number
  unrealizedPnl?: number
  realizedPnl: number
  isOpen: boolean
}

interface TradingState {
  trades: Trade[]
  portfolios: Portfolio[]
  positions: Position[]
  selectedPortfolio: Portfolio | null
  isLoading: boolean
  error: string | null
}

interface TradingActions {
  setTrades: (trades: Trade[]) => void
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, trade: Partial<Trade>) => void
  deleteTrade: (id: string) => void
  setPortfolios: (portfolios: Portfolio[]) => void
  setSelectedPortfolio: (portfolio: Portfolio | null) => void
  setPositions: (positions: Position[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
}

type TradingStore = TradingState & TradingActions

const initialState: TradingState = {
  trades: [],
  portfolios: [],
  positions: [],
  selectedPortfolio: null,
  isLoading: false,
  error: null,
}

export const useTradingStore = create<TradingStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setTrades: (trades) => set({ trades }),
      
      addTrade: (trade) => 
        set((state) => ({ trades: [...state.trades, trade] })),
      
      updateTrade: (id, updatedTrade) =>
        set((state) => ({
          trades: state.trades.map((trade) =>
            trade.id === id ? { ...trade, ...updatedTrade } : trade
          ),
        })),
      
      deleteTrade: (id) =>
        set((state) => ({
          trades: state.trades.filter((trade) => trade.id !== id),
        })),
      
      setPortfolios: (portfolios) => set({ portfolios }),
      
      setSelectedPortfolio: (portfolio) => set({ selectedPortfolio: portfolio }),
      
      setPositions: (positions) => set({ positions }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      resetState: () => set(initialState),
    }),
    {
      name: 'trading-store',
    }
  )
)
