// Trade types for the application
export interface EnhancedTrade {
  id: string
  userId: string
  symbol: string
  entryDate: string
  entryTime: string
  type: 'Call' | 'Put'
  entryPrice: number
  quantity: number
  stopLoss?: number
  riskPerTrade?: number
  followSetup: 'yes' | 'no'
  mood: 'Neutral' | 'Calm' | 'Anxious' | 'Confident' | 'Panicked'
  tradeNotes?: string
  setup?: string
  mistakes?: 'Emotional decision' | 'FOMO' | 'Over trading' | 'Poor Risk to reward' | 'None'
  
  // Trade status and exit tracking
  status: 'in-progress' | 'completed' | 'cancelled'
  exitDate?: string
  exitTime?: string
  exitPrice?: number
  realizedPnl?: number
  exitNotes?: string
  
  createdAt: string
  updatedAt: string
}

export interface BasicTrade {
  id: string
  userId: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  totalValue: number
  fees?: number
  executedAt: Date
  strategy?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// For display purposes in components
export interface TradeDisplayData extends EnhancedTrade {
  // Additional computed fields for display
  totalValue: number
  side: 'buy' | 'sell' // Derived from type and context
  executedAt: Date // Derived from entryDate and entryTime
}
