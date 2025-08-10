'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

// Mock data - replace with real data from your store/API
const mockStats = {
  totalValue: 125000,
  totalPnL: 8500,
  totalPnLPercentage: 0.073,
  totalTrades: 156,
  winRate: 0.68,
}

export function DashboardStats() {
  const { totalValue, totalPnL, totalPnLPercentage, totalTrades, winRate } = mockStats
  const isProfit = totalPnL > 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            +2.5% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          {isProfit ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalPnL)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(totalPnLPercentage)} return
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrades}</div>
          <p className="text-xs text-muted-foreground">
            +12 from last week
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(winRate)}</div>
          <p className="text-xs text-muted-foreground">
            Above average
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
