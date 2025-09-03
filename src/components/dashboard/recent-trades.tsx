"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EditTradeModal } from './edit-trade-modal'
import { ExitTradeModal } from './exit-trade-modal'
import { Edit2, LogOut, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { type EnhancedTrade } from '@/lib/api/enhanced-trades'
import { 
  CompletedTradeData, 
  getCompletedTrades, 
  saveCompletedTrade, 
  isTradeCompleted,
  getEffectiveTradeStatus 
} from '@/lib/completed-trades-storage'
import toast from 'react-hot-toast'

// Mock data - replace with real data from your store/API
const mockTrades: EnhancedTrade[] = [
  {
    id: '1',
    userId: 'user1',
    symbol: 'NIFTY 19000 CE',
    entryDate: '2025-08-09',
    entryTime: '10:30',
    type: 'Call',
    entryPrice: 150.25,
    quantity: 100,
    followSetup: 'yes',
    mood: 'Confident',
    status: 'in-progress',
    createdAt: new Date('2025-08-09T10:30:00Z'),
    updatedAt: new Date('2025-08-09T10:30:00Z'),
  },
  {
    id: '2',
    userId: 'user1',
    symbol: 'BANKNIFTY 45000 PE',
    entryDate: '2025-08-09',
    entryTime: '14:15',
    type: 'Put',
    entryPrice: 275.80,
    quantity: 50,
    followSetup: 'yes',
    mood: 'Neutral',
    status: 'in-progress',
    createdAt: new Date('2025-08-09T14:15:00Z'),
    updatedAt: new Date('2025-08-09T14:15:00Z'),
  },
  {
    id: '3',
    userId: 'user1',
    symbol: 'NIFTY 18800 CE',
    entryDate: '2025-08-08',
    entryTime: '11:20',
    type: 'Call',
    entryPrice: 310.45,
    quantity: 75,
    followSetup: 'yes',
    mood: 'Calm',
    status: 'completed',
    exitDate: '2025-08-08',
    exitTime: '15:20',
    exitPrice: 320.45,
    realizedPnl: 750.00,
    createdAt: new Date('2025-08-08T11:20:00Z'),
    updatedAt: new Date('2025-08-08T15:20:00Z'),
  },
]

export function RecentTrades() {
  // State to track completed trades - initialized from localStorage
  const [completedTrades, setCompletedTrades] = useState<Map<string, CompletedTradeData>>(new Map())

  // Load completed trades from localStorage on mount
  useEffect(() => {
    const storedCompletedTrades = getCompletedTrades()
    setCompletedTrades(storedCompletedTrades)
  }, [])

  const handleTradeUpdated = (updatedTrade: EnhancedTrade) => {
    // Handle trade update - refresh data, update state, etc.
    console.log('Trade updated:', updatedTrade)
  }

  const handleTradeExited = (exitedTrade: EnhancedTrade) => {
    // Save completed trade to localStorage
    const completedTradeData: CompletedTradeData = {
      id: exitedTrade.id,
      status: 'completed',
      exitDate: exitedTrade.exitDate || '',
      exitTime: exitedTrade.exitTime || '',
      exitPrice: exitedTrade.exitPrice || 0,
      realizedPnl: exitedTrade.realizedPnl || 0,
      exitNotes: exitedTrade.exitNotes || '',
      completedAt: new Date().toISOString(),
    }
    
    saveCompletedTrade(completedTradeData)
    
    // Update local state
    setCompletedTrades(prev => new Map(prev).set(exitedTrade.id, completedTradeData))
    
    console.log('Trade exited:', exitedTrade)
  }

  const handleTradeDeleted = async (tradeId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')
    
    if (!confirmed) return
    
    try {
      const response = await fetch(`/api/trades/enhanced/${tradeId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete trade')
      }
      
      toast.success('Trade deleted successfully')
      
      // Remove from localStorage if it was completed
      const storedTrades = getCompletedTrades()
      storedTrades.delete(tradeId)
      localStorage.setItem('completed-trades', JSON.stringify(Array.from(storedTrades.entries())))
      
      // Update local state
      setCompletedTrades(prev => {
        const newMap = new Map(prev)
        newMap.delete(tradeId)
        return newMap
      })
      
      // In a real application, you would refresh the trades list here
      // For now, we'll just show a success message
      
    } catch (error) {
      console.error('Error deleting trade:', error)
      toast.error('Failed to delete trade')
    }
  }

  // Helper function to get effective status using localStorage
  const getEffectiveStatus = (trade: EnhancedTrade): string => {
    return getEffectiveTradeStatus(trade.id, trade.status)
  }

  // Helper function to get the effective trade data (with exit info if completed)
  const getEffectiveTrade = (trade: EnhancedTrade): EnhancedTrade => {
    const completedTrade = completedTrades.get(trade.id)
    if (completedTrade && isTradeCompleted(trade.id)) {
      return {
        ...trade,
        status: 'completed',
        exitDate: completedTrade.exitDate,
        exitTime: completedTrade.exitTime,
        exitPrice: completedTrade.exitPrice,
        realizedPnl: completedTrade.realizedPnl,
        exitNotes: completedTrade.exitNotes,
      } as EnhancedTrade
    }
    return trade
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-blue-600" /> // Default to in-progress for backward compatibility
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge> // Default to in-progress
    }
  }

  // Helper function to get total value
  const getTotalValue = (trade: EnhancedTrade) => {
    const entryPrice = typeof trade.entryPrice === 'string' ? parseFloat(trade.entryPrice) : trade.entryPrice
    const quantity = typeof trade.quantity === 'string' ? parseInt(trade.quantity) : trade.quantity
    return entryPrice * quantity
  }

  // Helper function to format date from entryDate/entryTime
  const getExecutedDate = (trade: EnhancedTrade) => {
    return new Date(`${trade.entryDate}T${trade.entryTime}:00`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTrades.map((trade) => {
            const effectiveTrade = getEffectiveTrade(trade)
            const effectiveStatus = getEffectiveStatus(trade)
            
            return (
            <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(effectiveStatus)}
                  <Badge variant={effectiveTrade.type === 'Call' ? 'default' : 'destructive'}>
                    {effectiveTrade.type.toUpperCase()}
                  </Badge>
                  {getStatusBadge(effectiveStatus)}
                </div>
                <div>
                  <p className="font-medium">{effectiveTrade.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {effectiveTrade.quantity} @ {formatCurrency(effectiveTrade.entryPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(getExecutedDate(effectiveTrade))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {trade.status === 'completed' && trade.realizedPnl !== undefined ? (
                    <p className={`font-medium ${trade.realizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.realizedPnl >= 0 ? '+' : ''}{formatCurrency(trade.realizedPnl)}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">-</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(getTotalValue(trade))}
                  </p>
                </div>
                
                {/* Action buttons for in-progress trades */}
                {effectiveStatus === 'in-progress' && (
                  <div className="flex gap-2">
                    <EditTradeModal 
                      trade={effectiveTrade}
                      onTradeUpdated={handleTradeUpdated}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      }
                    />
                    <ExitTradeModal 
                      trade={effectiveTrade}
                      onTradeExited={handleTradeExited}
                      trigger={
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <LogOut className="w-4 h-4 mr-1" />
                          Exit
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleTradeDeleted(trade.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
                
                {/* Action buttons for completed trades */}
                {effectiveStatus === 'completed' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleTradeDeleted(trade.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
