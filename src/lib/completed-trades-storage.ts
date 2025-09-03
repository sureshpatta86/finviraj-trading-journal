/**
 * Utility functions for managing completed trades in localStorage
 * This is a temporary solution until database migration is applied
 */

export interface CompletedTradeData {
  id: string
  status: 'completed'
  exitDate: string
  exitTime: string
  exitPrice: number
  realizedPnl: number
  exitNotes?: string
  completedAt: string // timestamp when trade was completed
}

const STORAGE_KEY = 'finviraj_completed_trades'

/**
 * Get all completed trades from localStorage
 */
export function getCompletedTrades(): Map<string, CompletedTradeData> {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Map()
    
    const data = JSON.parse(stored)
    return new Map(Object.entries(data))
  } catch (error) {
    console.error('Error loading completed trades from localStorage:', error)
    return new Map()
  }
}

/**
 * Save a completed trade to localStorage
 */
export function saveCompletedTrade(tradeData: CompletedTradeData): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingTrades = getCompletedTrades()
    existingTrades.set(tradeData.id, tradeData)
    
    const dataToStore = Object.fromEntries(existingTrades)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
  } catch (error) {
    console.error('Error saving completed trade to localStorage:', error)
  }
}

/**
 * Check if a trade is completed
 */
export function isTradeCompleted(tradeId: string): boolean {
  const completedTrades = getCompletedTrades()
  return completedTrades.has(tradeId)
}

/**
 * Get completed trade data for a specific trade
 */
export function getCompletedTradeData(tradeId: string): CompletedTradeData | null {
  const completedTrades = getCompletedTrades()
  return completedTrades.get(tradeId) || null
}

/**
 * Remove a completed trade from localStorage (for cleanup or if trade is re-opened)
 */
export function removeCompletedTrade(tradeId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingTrades = getCompletedTrades()
    existingTrades.delete(tradeId)
    
    const dataToStore = Object.fromEntries(existingTrades)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
  } catch (error) {
    console.error('Error removing completed trade from localStorage:', error)
  }
}

/**
 * Clear all completed trades (for testing or migration)
 */
export function clearCompletedTrades(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing completed trades from localStorage:', error)
  }
}

/**
 * Get effective status for a trade (completed if in localStorage, otherwise original status)
 */
export function getEffectiveTradeStatus(tradeId: string, originalStatus?: string): string {
  if (isTradeCompleted(tradeId)) {
    return 'completed'
  }
  return originalStatus || 'in-progress'
}
