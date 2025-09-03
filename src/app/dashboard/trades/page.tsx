"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { useTradingStore } from "@/store/trading"
import { 
  CompletedTradeData, 
  getCompletedTrades, 
  saveCompletedTrade, 
  isTradeCompleted,
  getEffectiveTradeStatus 
} from '@/lib/completed-trades-storage'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddTradeModal } from "@/components/dashboard/add-trade-modal"
import { EditTradeModal } from "@/components/dashboard/edit-trade-modal"
import { ExitTradeModal } from "@/components/dashboard/exit-trade-modal"
import { 
  CalendarDays, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  Brain, 
  AlertTriangle,
  Plus,
  Filter,
  Edit2,
  LogOut,
  CheckCircle,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type EnhancedTrade } from "@/lib/api/enhanced-trades"

export default function TradeLogPage() {
  const { data: session } = useSession()
  const { enhancedTrades, loadEnhancedTrades, isLoading } = useTradingStore()
  
  // State to track completed trades - initialized from localStorage
  const [completedTrades, setCompletedTrades] = useState<Map<string, CompletedTradeData>>(new Map())

  // Load completed trades from localStorage on mount
  useEffect(() => {
    const storedCompletedTrades = getCompletedTrades()
    setCompletedTrades(storedCompletedTrades)
  }, [])

  // Load trades when component mounts and user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      // Use the authenticated user's unique ID to load their specific trades
      loadEnhancedTrades(session.user.id)
    }
  }, [session, loadEnhancedTrades])

  const handleTradeUpdated = () => {
    // Handle trade update - refresh data
    if (session?.user?.id) {
      loadEnhancedTrades(session.user.id)
    }
  }

  const handleTradeAdded = () => {
    // Handle new trade added - refresh data
    if (session?.user?.id) {
      loadEnhancedTrades(session.user.id)
    }
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
    
    // Also refresh data from server
    if (session?.user?.id) {
      loadEnhancedTrades(session.user.id)
    }
  }

  const handleTradeDeleted = async (tradeId: string) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to delete trade")
      return
    }

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this trade? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/trades/enhanced/${tradeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete trade')
      }

      toast.success("Trade deleted successfully!")
      
      // Refresh trades list
      if (session?.user?.id) {
        loadEnhancedTrades(session.user.id)
      }
    } catch (error) {
      console.error('Error deleting trade:', error)
      toast.error("Failed to delete trade. Please try again.")
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Confident':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Calm':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'Anxious':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Panicked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'Call' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trade Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage all your trading activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <AddTradeModal onTradeAdded={handleTradeAdded} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enhancedTrades.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedTrades.filter(trade => trade.type === 'Call').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Put Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedTrades.filter(trade => trade.type === 'Put').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setup Followed</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedTrades.filter(trade => trade.followSetup === 'yes').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trades List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Loading trades...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch your trading data.
            </p>
          </CardContent>
        </Card>
      ) : enhancedTrades.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trades logged yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start logging your trades to track your performance and improve your trading strategy.
            </p>
            <AddTradeModal onTradeAdded={handleTradeAdded} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enhancedTrades.map((trade) => {
            const effectiveTrade = getEffectiveTrade(trade)
            const effectiveStatus = getEffectiveStatus(trade)
            
            return (
            <Card key={trade.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Trade Basic Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{effectiveTrade.symbol}</h3>
                      <Badge className={cn("text-xs", getTypeColor(effectiveTrade.type))}>
                        {effectiveTrade.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(effectiveStatus)}
                      {getStatusBadge(effectiveStatus)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(effectiveTrade.entryDate)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {formatTime(effectiveTrade.entryTime)}
                    </div>
                  </div>

                  {/* Trade Details */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-semibold">₹{effectiveTrade.entryPrice}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {effectiveTrade.quantity}
                    </div>
                    {effectiveTrade.stopLoss && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        SL: ₹{effectiveTrade.stopLoss}
                      </div>
                    )}
                    {effectiveStatus === 'completed' && effectiveTrade.exitPrice && (
                      <div className="text-sm font-semibold text-green-600">
                        Exit: ₹{effectiveTrade.exitPrice}
                      </div>
                    )}
                    {effectiveStatus === 'completed' && effectiveTrade.realizedPnl && (
                      <div className={cn("text-sm font-semibold", 
                        parseFloat(effectiveTrade.realizedPnl.toString()) >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        P&L: {parseFloat(effectiveTrade.realizedPnl.toString()) >= 0 ? '+' : ''}₹{effectiveTrade.realizedPnl}
                      </div>
                    )}
                  </div>

                  {/* Psychology */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <Badge className={cn("text-xs", getMoodColor(effectiveTrade.mood))}>
                        {effectiveTrade.mood}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        trade.followSetup === 'yes' 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      )}>
                        Setup: {trade.followSetup}
                      </span>
                    </div>
                    {trade.mistakes && trade.mistakes !== 'None' && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          {trade.mistakes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes and Actions */}
                  <div className="lg:col-span-3 space-y-2">
                    {trade.setup && (
                      <div>
                        <h4 className="text-sm font-semibold">Setup:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {trade.setup}
                        </p>
                      </div>
                    )}
                    {trade.tradeNotes && (
                      <div>
                        <h4 className="text-sm font-semibold">Notes:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {trade.tradeNotes}
                        </p>
                      </div>
                    )}
                    {trade.exitNotes && (
                      <div>
                        <h4 className="text-sm font-semibold">Exit Notes:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {trade.exitNotes}
                        </p>
                      </div>
                    )}
                    
                    {/* Action buttons for in-progress trades */}
                    {effectiveStatus === 'in-progress' && (
                      <div className="flex gap-2 pt-2">
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
                          onClick={() => handleTradeDeleted(effectiveTrade.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    
                    {/* Delete button for completed trades */}
                    {effectiveStatus === 'completed' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleTradeDeleted(effectiveTrade.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
