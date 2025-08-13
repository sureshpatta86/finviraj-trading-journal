// API utility functions for enhanced trades

export interface EnhancedTradeData {
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
}

export interface EnhancedTrade extends EnhancedTradeData {
  id: string
  createdAt: Date
  updatedAt: Date
}

const API_BASE = '/api/trades/enhanced'

export class EnhancedTradeAPI {
  /**
   * Create a new enhanced trade
   */
  static async createTrade(tradeData: EnhancedTradeData): Promise<EnhancedTrade> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tradeData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create trade')
    }

    const result = await response.json()
    return result.trade
  }

  /**
   * Get all trades for a user
   */
  static async getTrades(userId: string): Promise<EnhancedTrade[]> {
    const response = await fetch(`${API_BASE}?userId=${encodeURIComponent(userId)}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch trades')
    }

    const result = await response.json()
    return result.trades
  }

  /**
   * Update an existing trade
   */
  static async updateTrade(
    tradeId: string, 
    updateData: Partial<EnhancedTradeData>
  ): Promise<EnhancedTrade> {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: tradeId, ...updateData }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update trade')
    }

    const result = await response.json()
    return result.trade
  }

  /**
   * Delete a trade
   */
  static async deleteTrade(tradeId: string): Promise<void> {
    const response = await fetch(`${API_BASE}?id=${encodeURIComponent(tradeId)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete trade')
    }
  }
}
