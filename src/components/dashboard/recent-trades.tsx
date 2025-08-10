'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data - replace with real data from your store/API
const mockTrades = [
  {
    id: '1',
    symbol: 'AAPL',
    side: 'buy' as const,
    quantity: 100,
    price: 150.25,
    totalValue: 15025,
    executedAt: new Date('2025-08-09T10:30:00'),
    pnl: 425.50,
  },
  {
    id: '2',
    symbol: 'TSLA',
    side: 'sell' as const,
    quantity: 50,
    price: 275.80,
    totalValue: 13790,
    executedAt: new Date('2025-08-09T14:15:00'),
    pnl: -125.30,
  },
  {
    id: '3',
    symbol: 'MSFT',
    side: 'buy' as const,
    quantity: 75,
    price: 310.45,
    totalValue: 23283.75,
    executedAt: new Date('2025-08-08T11:20:00'),
    pnl: 150.00,
  },
]

export function RecentTrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge variant={trade.side === 'buy' ? 'default' : 'destructive'}>
                  {trade.side.toUpperCase()}
                </Badge>
                <div>
                  <p className="font-medium">{trade.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {trade.quantity} @ {formatCurrency(trade.price)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(trade.executedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
