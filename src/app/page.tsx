'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  PlusCircle, 
  BarChart3, 
  DollarSign, 
  LogOut,
  Users,
  MessageSquare,
  Info,
  TrendingDown,
  Activity,
  Target,
  Brain,
  Shield,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Mock data for demonstration
const mockData = {
  trades: {
    open: 3,
    closed: 12,
    total: 15
  },
  pnl: {
    total: 204250.50,
    today: 10430.30,
    percentage: 8.75
  },
  winRate: 73.3,
  rulesFollowing: 85,
  account: {
    balance: 1312500.00,
    gain: 204250.50,
    gainPercentage: 18.4
  },
  aiInsights: {
    performance: 82,
    riskReward: 1.85,
    strategy: 76
  }
}

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value (₹)',
      data: [833000, 875000, 933600, 900400, 1041500, 1312500],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
}

const winLossData = {
  labels: ['Wins', 'Losses'],
  datasets: [
    {
      data: [11, 4],
      backgroundColor: ['#10b981', '#ef4444'],
      hoverBackgroundColor: ['#059669', '#dc2626'],
    },
  ],
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Always show hero page by default, but allow switching to dashboard if authenticated
  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
        <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinViraj Trading Journal
              </span>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/feedback">Feedback</Link>
              </Button>
              <ThemeToggle />
              {status === 'authenticated' ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDashboard(true)}
                  >
                    Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Welcome, {session?.user?.name || 'User'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Master Your Trading Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional trading journal with AI insights, performance analytics, and rule-based trading to maximize your profits and minimize risks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="px-8 py-4 text-lg">
                <Link href="/auth/signup">Start Trading Journal</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-4 text-lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Live Demo Data */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-2xl border shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Live Trading Dashboard Preview</h2>
            
            {/* Open Trades & Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Trades</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{mockData.trades.open}</div>
                  <p className="text-xs text-green-600 dark:text-green-400">Active positions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ₹{mockData.pnl.total.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    +{mockData.pnl.percentage}% this month
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {mockData.winRate}%
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {mockData.trades.closed} total trades
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rules Following</CardTitle>
                  <Shield className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {mockData.rulesFollowing}%
                  </div>
                  <Badge variant="secondary" className="text-xs">Excellent</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Account Summary & AI Insights */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account Balance</span>
                      <span className="font-semibold">₹{mockData.account.balance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Gain</span>
                      <span className="font-semibold text-green-600">
                        +₹{mockData.account.gain.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Gain Percentage</span>
                      <span className="font-semibold text-green-600">+{mockData.account.gainPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Performance Score</span>
                      <Badge variant="default">{mockData.aiInsights.performance}/100</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk:Reward Ratio</span>
                      <Badge variant="secondary">1:{mockData.aiInsights.riskReward}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Strategy Pattern</span>
                      <Badge variant="outline">{mockData.aiInsights.strategy}% Match</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Win/Loss Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-48 h-48">
                      <Doughnut data={winLossData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive performance tracking with detailed charts and insights.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent recommendations and pattern recognition for better trading.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rule-Based Trading</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set and track your trading rules to maintain discipline and consistency.
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trading?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of traders who have improved their performance with our journal.
              </p>
              <Button size="lg" variant="secondary" asChild className="px-8 py-4 text-lg">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Authenticated user dashboard (only shown when user clicks Dashboard)
  if (showDashboard && status === 'authenticated') {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span className="font-bold text-xl">FinViraj Trading Journal</span>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowDashboard(false)}>
                Home
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/feedback">Feedback</Link>
              </Button>
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {session?.user?.name || 'User'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your trades, analyze performance, and grow your portfolio.
            </p>
          </div>

          {/* Same dashboard content as mockData above but with real data */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0.00</div>
                <p className="text-xs text-muted-foreground">No trades yet</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start trading to see data</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--%</div>
                <p className="text-xs text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">P&L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0.00</div>
                <p className="text-xs text-muted-foreground">No profit/loss data</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Add New Trade</CardTitle>
                <CardDescription>Record a new trading position</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Trade
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>View Portfolio</CardTitle>
                <CardDescription>Analyze your current positions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Portfolio
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading History</CardTitle>
                <CardDescription>Review past trades and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Default: Always show hero page first
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinViraj Trading Journal
            </span>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/feedback">Feedback</Link>
            </Button>
            <ThemeToggle />
            {status === 'authenticated' ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowDashboard(true)}
                >
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Welcome, {session?.user?.name || 'User'}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Master Your Trading Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional trading journal with AI insights, performance analytics, and rule-based trading to maximize your profits and minimize risks in Indian markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="px-8 py-4 text-lg">
              <Link href="/auth/signup">Start Trading Journal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-4 text-lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Live Demo Data */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-2xl border shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Trading Dashboard Preview</h2>
          
          {/* Open Trades & Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Trades</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{mockData.trades.open}</div>
                <p className="text-xs text-green-600 dark:text-green-400">Active positions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ₹{mockData.pnl.total.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  +{mockData.pnl.percentage}% this month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {mockData.winRate}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {mockData.trades.closed} total trades
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rules Following</CardTitle>
                <Shield className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {mockData.rulesFollowing}%
                </div>
                <Badge variant="secondary" className="text-xs">Excellent</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary & AI Insights */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Balance</span>
                    <span className="font-semibold">₹{mockData.account.balance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Gain</span>
                    <span className="font-semibold text-green-600">
                      +₹{mockData.account.gain.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gain Percentage</span>
                    <span className="font-semibold text-green-600">+{mockData.account.gainPercentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance Score</span>
                    <Badge variant="default">{mockData.aiInsights.performance}/100</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk:Reward Ratio</span>
                    <Badge variant="secondary">1:{mockData.aiInsights.riskReward}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Strategy Pattern</span>
                    <Badge variant="outline">{mockData.aiInsights.strategy}% Match</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-48 h-48">
                    <Doughnut data={winLossData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive performance tracking with detailed charts and insights.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get intelligent recommendations and pattern recognition for better trading.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rule-Based Trading</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set and track your trading rules to maintain discipline and consistency.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trading?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of traders who have improved their performance with our journal.
            </p>
            <Button size="lg" variant="secondary" asChild className="px-8 py-4 text-lg">
              <Link href="/auth/signup">Start Your Free Trial</Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
