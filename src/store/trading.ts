import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type EnhancedTradeFormData } from '@/lib/validations'
import { EnhancedTradeAPI, type EnhancedTrade as APIEnhancedTrade } from '@/lib/api/enhanced-trades'

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

// Enhanced trade interface for comprehensive trade logging
type EnhancedTrade = APIEnhancedTrade

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
  enhancedTrades: EnhancedTrade[]
  portfolios: Portfolio[]
  positions: Position[]
  selectedPortfolio: Portfolio | null
  isLoading: boolean
  error: string | null
}

interface TradingActions {
  setTrades: (trades: Trade[]) => void
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, updatedTrade: Partial<Trade>) => void
  deleteTrade: (id: string) => void
  setEnhancedTrades: (enhancedTrades: EnhancedTrade[]) => void
  loadEnhancedTrades: (userId: string) => Promise<void>
  addEnhancedTrade: (userId: string, tradeData: EnhancedTradeFormData) => Promise<void>
  updateEnhancedTrade: (id: string, updatedTrade: Partial<EnhancedTradeFormData>) => Promise<void>
  deleteEnhancedTrade: (id: string) => Promise<void>
  setPortfolios: (portfolios: Portfolio[]) => void
  addPortfolio: (portfolio: Portfolio) => void
  updatePortfolio: (id: string, updatedPortfolio: Partial<Portfolio>) => void
  deletePortfolio: (id: string) => void
  setSelectedPortfolio: (portfolio: Portfolio | null) => void
  setPositions: (positions: Position[]) => void
  addPosition: (position: Position) => void
  updatePosition: (id: string, updatedPosition: Partial<Position>) => void
  deletePosition: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
}

type TradingStore = TradingState & TradingActions

const initialState: TradingState = {
  trades: [],
  enhancedTrades: [],
  portfolios: [],
  positions: [],
  selectedPortfolio: null,
  isLoading: false,
  error: null,
}

export const useTradingStore = create<TradingStore>()(
  devtools(
    (set) => ({
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

      setEnhancedTrades: (enhancedTrades) => set({ enhancedTrades }),
      
      loadEnhancedTrades: async (userId) => {
        try {
          set({ isLoading: true, error: null })
          const trades = await EnhancedTradeAPI.getTrades(userId)
          set({ enhancedTrades: trades, isLoading: false })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load trades', isLoading: false })
        }
      },
      
      addEnhancedTrade: async (userId, tradeData) => {
        try {
          set({ isLoading: true, error: null })
          const newTrade = await EnhancedTradeAPI.createTrade({ userId, ...tradeData })
          set((state) => ({ 
            enhancedTrades: [...state.enhancedTrades, newTrade],
            isLoading: false
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create trade', isLoading: false })
        }
      },
      
      updateEnhancedTrade: async (id, updatedTrade) => {
        try {
          set({ isLoading: true, error: null })
          const updated = await EnhancedTradeAPI.updateTrade(id, updatedTrade)
          set((state) => ({
            enhancedTrades: state.enhancedTrades.map((trade) =>
              trade.id === id ? updated : trade
            ),
            isLoading: false
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update trade', isLoading: false })
        }
      },
      
      deleteEnhancedTrade: async (id) => {
        try {
          set({ isLoading: true, error: null })
          await EnhancedTradeAPI.deleteTrade(id)
          set((state) => ({
            enhancedTrades: state.enhancedTrades.filter((trade) => trade.id !== id),
            isLoading: false
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete trade', isLoading: false })
        }
      },
      
      setPortfolios: (portfolios) => set({ portfolios }),
      
      addPortfolio: (portfolio) =>
        set((state) => ({ portfolios: [...state.portfolios, portfolio] })),
      
      updatePortfolio: (id, updatedPortfolio) =>
        set((state) => ({
          portfolios: state.portfolios.map((portfolio) =>
            portfolio.id === id ? { ...portfolio, ...updatedPortfolio } : portfolio
          ),
        })),
      
      deletePortfolio: (id) =>
        set((state) => ({
          portfolios: state.portfolios.filter((portfolio) => portfolio.id !== id),
        })),
      
      setSelectedPortfolio: (portfolio) => set({ selectedPortfolio: portfolio }),
      
      setPositions: (positions) => set({ positions }),
      
      addPosition: (position) =>
        set((state) => ({ positions: [...state.positions, position] })),
      
      updatePosition: (id, updatedPosition) =>
        set((state) => ({
          positions: state.positions.map((position) =>
            position.id === id ? { ...position, ...updatedPosition } : position
          ),
        })),
      
      deletePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((position) => position.id !== id),
        })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      resetState: () => set(initialState),
    }),
    {
      name: 'trading-store',
    }
  )
)
