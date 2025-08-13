"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTradingStore } from "@/store/trading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddTradeModal } from "@/components/dashboard/add-trade-modal"
import { 
  CalendarDays, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  Brain, 
  AlertTriangle,
  Plus,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function TradeLogPage() {
  const { data: session } = useSession()
  const { enhancedTrades, loadEnhancedTrades, isLoading } = useTradingStore()

  // Load trades when component mounts and user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      // Use the authenticated user's unique ID to load their specific trades
      loadEnhancedTrades(session.user.id)
    }
  }, [session, loadEnhancedTrades])

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
          <AddTradeModal />
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
            <AddTradeModal />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enhancedTrades.map((trade) => (
            <Card key={trade.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Trade Basic Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{trade.symbol}</h3>
                      <Badge className={cn("text-xs", getTypeColor(trade.type))}>
                        {trade.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(trade.entryDate)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {formatTime(trade.entryTime)}
                    </div>
                  </div>

                  {/* Trade Details */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-semibold">₹{trade.entryPrice}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {trade.quantity}
                    </div>
                    {trade.stopLoss && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        SL: ₹{trade.stopLoss}
                      </div>
                    )}
                  </div>

                  {/* Psychology */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <Badge className={cn("text-xs", getMoodColor(trade.mood))}>
                        {trade.mood}
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

                  {/* Notes */}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
