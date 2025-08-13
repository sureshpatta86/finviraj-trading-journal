'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Plus,
  Calendar,
  BarChart3
} from 'lucide-react'
import { AddTradeModal } from './add-trade-modal'

export function DashboardOverview() {
  const stats = [
    {
      title: 'Total Portfolio Value',
      value: '₹45,231.89',
      change: '+20.1%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Total P&L',
      value: '+₹2,350.00',
      change: '+180.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Win Rate',
      value: '78.2%',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: Activity,
    },
    {
      title: 'Active Trades',
      value: '12',
      change: '-3',
      changeType: 'negative' as const,
      icon: BarChart3,
    },
  ]

  const recentTrades = [
    {
      symbol: 'AAPL',
      type: 'Buy',
      quantity: 100,
      price: 175.50,
      pnl: +450.00,
      date: '2025-01-15',
    },
    {
      symbol: 'MSFT',
      type: 'Sell',
      quantity: 50,
      price: 420.30,
      pnl: -125.50,
      date: '2025-01-14',
    },
    {
      symbol: 'GOOGL',
      type: 'Buy',
      quantity: 25,
      price: 140.75,
      pnl: +320.00,
      date: '2025-01-13',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here&apos;s what&apos;s happening with your trading portfolio today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <AddTradeModal />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Recent Trades</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrades.map((trade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {trade.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {trade.symbol}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {trade.type} {trade.quantity} @ ₹{trade.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      trade.pnl >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(trade.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddTradeModal 
          trigger={
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Add New Trade
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Record a new trade in your journal
                </p>
              </CardContent>
            </Card>
          }
        />

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              View Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze your trading performance
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Trading Calendar
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your trading schedule
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
