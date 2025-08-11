'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  TrendingUp, 
  ArrowLeft,
  Target,
  Users,
  Award,
  Shield,
  Brain,
  BarChart3,
  Globe,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
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
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/feedback">Feedback</Link>
            </Button>
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              About FinViraj
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Empowering traders worldwide with intelligent journaling and analytics
            </p>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Mission Statement */}
          <Card className="mb-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl opacity-90 leading-relaxed">
                To revolutionize trading education and performance by providing Indian traders with the most 
                comprehensive, intelligent, and user-friendly trading journal platform that transforms 
                data into actionable insights for NSE, BSE, and other Indian markets.
              </p>
            </div>
          </Card>

          {/* Our Story */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                FinViraj Trading Journal was born from the frustration of countless traders who struggled to maintain 
                consistent profitability despite having solid strategies. We realized that the missing 
                piece wasn't just better analysis tools, but a comprehensive system that could track, 
                analyze, and guide traders toward disciplined, rule-based trading.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Founded by a team of experienced traders, data scientists, and software engineers, 
                FinViraj Trading Journal combines decades of trading expertise with cutting-edge technology to create 
                a platform that doesn't just track your trades—it helps you become a better trader.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, FinViraj Trading Journal serves thousands of traders worldwide, from beginners taking their 
                first steps in the markets to professional traders managing significant portfolios. 
                Our commitment remains unchanged: to provide the tools and insights that turn trading 
                from gambling into a systematic, profitable endeavor.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Target className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Precision</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every feature is designed with accuracy and attention to detail, 
                  ensuring your trading data is captured and analyzed with precision.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in honest feedback and transparent analytics. 
                  Our platform shows you the truth about your trading performance.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Brain className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We continuously push the boundaries of what's possible with 
                  AI-driven insights and advanced analytics.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Trading can be lonely. We foster a community of traders 
                  supporting each other's growth and success.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Empathy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We understand the emotional journey of trading and design 
                  our platform to support traders through all market conditions.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Globe className="h-12 w-12 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Professional-grade trading tools should be accessible to everyone, 
                  regardless of experience level or portfolio size.
                </p>
              </Card>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">AI-Powered Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our advanced AI algorithms analyze your trading patterns, identify strengths 
                      and weaknesses, and provide personalized recommendations for improvement.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Rule-Based Framework</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Set up your trading rules once, and our platform will track your adherence, 
                      helping you maintain discipline and consistency in your trading approach.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Comprehensive performance metrics including win rates, risk-reward ratios, 
                      drawdown analysis, and more, all presented in intuitive, actionable formats.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Educational Focus</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Beyond just tracking, we educate. Every insight comes with explanations 
                      and actionable advice to help you understand and improve your trading.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
              <p className="text-xl mb-8 opacity-90">
                Discover how FinViraj can transform your trading journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/feedback">Contact Us</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
