"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  LineChart,
  Target,
  Award,
  Zap,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface InsightMetrics {
  fraudPrevention: {
    totalSaved: number
    fraudAttempts: number
    preventionRate: number
    avgResponseTime: number
  }
  trustScores: {
    averageScore: number
    highTrustCustomers: number
    improvementRate: number
    verifiedCustomers: number
  }
  systemPerformance: {
    accuracy: number
    uptime: number
    throughput: number
    falsePositives: number
  }
  trends: {
    fraudTrends: Array<{ month: string; attempts: number; prevented: number }>
    trustTrends: Array<{ month: string; avgScore: number; newCustomers: number }>
    performanceTrends: Array<{ month: string; accuracy: number; responseTime: number }>
  }
}

export default function InsightsPage() {
  const [metrics, setMetrics] = useState<InsightMetrics>({
    fraudPrevention: {
      totalSaved: 2400000,
      fraudAttempts: 3247,
      preventionRate: 97.8,
      avgResponseTime: 47,
    },
    trustScores: {
      averageScore: 78.5,
      highTrustCustomers: 18456,
      improvementRate: 12.3,
      verifiedCustomers: 24847,
    },
    systemPerformance: {
      accuracy: 99.2,
      uptime: 99.97,
      throughput: 2847,
      falsePositives: 0.8,
    },
    trends: {
      fraudTrends: [
        { month: "Jan", attempts: 2890, prevented: 2825 },
        { month: "Feb", attempts: 3120, prevented: 3051 },
        { month: "Mar", attempts: 2756, prevented: 2698 },
        { month: "Apr", attempts: 3247, prevented: 3175 },
        { month: "May", attempts: 2934, prevented: 2871 },
        { month: "Jun", attempts: 3156, prevented: 3089 },
      ],
      trustTrends: [
        { month: "Jan", avgScore: 75.2, newCustomers: 1247 },
        { month: "Feb", avgScore: 76.1, newCustomers: 1389 },
        { month: "Mar", avgScore: 77.3, newCustomers: 1156 },
        { month: "Apr", avgScore: 78.5, newCustomers: 1423 },
        { month: "May", avgScore: 79.1, newCustomers: 1298 },
        { month: "Jun", avgScore: 78.9, newCustomers: 1367 },
      ],
      performanceTrends: [
        { month: "Jan", accuracy: 98.7, responseTime: 52 },
        { month: "Feb", accuracy: 98.9, responseTime: 49 },
        { month: "Mar", accuracy: 99.1, responseTime: 48 },
        { month: "Apr", accuracy: 99.2, responseTime: 47 },
        { month: "May", accuracy: 99.3, responseTime: 45 },
        { month: "Jun", accuracy: 99.2, responseTime: 47 },
      ],
    },
  })

  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        fraudPrevention: {
          ...prev.fraudPrevention,
          totalSaved: prev.fraudPrevention.totalSaved + Math.floor(Math.random() * 10000),
          fraudAttempts: prev.fraudPrevention.fraudAttempts + Math.floor(Math.random() * 3),
          avgResponseTime: Math.round((prev.fraudPrevention.avgResponseTime + (Math.random() - 0.5) * 5) * 10) / 10,
        },
        trustScores: {
          ...prev.trustScores,
          averageScore: Math.round((prev.trustScores.averageScore + (Math.random() - 0.5) * 2) * 10) / 10,
          highTrustCustomers: prev.trustScores.highTrustCustomers + Math.floor(Math.random() * 5),
        },
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getChangeIndicator = (value: number, isPositive = true) => {
    const color = (isPositive && value > 0) || (!isPositive && value < 0) ? "text-green-400" : "text-red-400"
    const icon = value > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        {icon}
        <span className="text-xs">{Math.abs(value)}%</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Security Analytics</h1>
              <p className="text-xl text-slate-300">Comprehensive Fraud Prevention Insights</p>
              <p className="text-slate-400 mt-2">
                Advanced analytics and intelligence for optimizing fraud prevention strategies
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedPeriod === "30days" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("30days")}
              >
                30 Days
              </Button>
              <Button
                variant={selectedPeriod === "6months" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("6months")}
              >
                6 Months
              </Button>
              <Button
                variant={selectedPeriod === "1year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("1year")}
              >
                1 Year
              </Button>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Fraud Prevented</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(metrics.fraudPrevention.totalSaved)}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">This month</p>
                  {getChangeIndicator(15.3)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Prevention Rate</CardTitle>
                <Shield className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.fraudPrevention.preventionRate}%</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">Success rate</p>
                  {getChangeIndicator(2.1)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Avg Trust Score</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.trustScores.averageScore}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">Customer trust</p>
                  {getChangeIndicator(3.7)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">System Accuracy</CardTitle>
                <Target className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.systemPerformance.accuracy}%</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">AI precision</p>
                  {getChangeIndicator(0.5)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Tabs */}
          <Tabs defaultValue="fraud" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="fraud" className="data-[state=active]:bg-blue-600">
                Fraud Prevention
              </TabsTrigger>
              <TabsTrigger value="trust" className="data-[state=active]:bg-blue-600">
                Trust Analytics
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
                System Performance
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">
                Trend Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fraud" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      Fraud Detection Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">
                          {formatNumber(metrics.fraudPrevention.fraudAttempts)}
                        </div>
                        <div className="text-sm text-slate-400">Fraud Attempts</div>
                      </div>
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.floor(
                            (metrics.fraudPrevention.fraudAttempts * metrics.fraudPrevention.preventionRate) / 100,
                          )}
                        </div>
                        <div className="text-sm text-slate-400">Prevented</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Response Time</span>
                        <span className="text-white">{metrics.fraudPrevention.avgResponseTime}ms</span>
                      </div>
                      <Progress value={85} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">False Positives</span>
                        <span className="text-yellow-400">{metrics.systemPerformance.falsePositives}%</span>
                      </div>
                      <Progress value={metrics.systemPerformance.falsePositives} className="h-2" />
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-slate-300 font-medium mb-3">Top Fraud Types Detected</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Card Testing</span>
                          <span className="text-white">34%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account Takeover</span>
                          <span className="text-white">28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fake Returns</span>
                          <span className="text-white">23%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Coupon Fraud</span>
                          <span className="text-white">15%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      Monthly Fraud Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.trends.fraudTrends.map((trend, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">{trend.month}</span>
                            <span className="text-white">
                              {Math.round((trend.prevented / trend.attempts) * 100)}% prevented
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-red-400 h-2 rounded-full"
                                style={{ width: `${(trend.attempts / 3500) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-green-400 h-2 rounded-full"
                                style={{ width: `${(trend.prevented / 3500) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{trend.attempts} attempts</span>
                            <span>{trend.prevented} prevented</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trust" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-400" />
                      Trust Score Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {formatNumber(metrics.trustScores.highTrustCustomers)}
                        </div>
                        <div className="text-sm text-slate-400">High Trust (80+)</div>
                      </div>
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatNumber(metrics.trustScores.verifiedCustomers)}
                        </div>
                        <div className="text-sm text-slate-400">Verified Customers</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">High Trust (80-100)</span>
                          <span className="text-green-400">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Medium Trust (60-79)</span>
                          <span className="text-yellow-400">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Low Trust (40-59)</span>
                          <span className="text-orange-400">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">High Risk (0-39)</span>
                          <span className="text-red-400">5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Improvement Rate</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400">{metrics.trustScores.improvementRate}%</span>
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <LineChart className="h-5 w-5 mr-2 text-green-400" />
                      Trust Score Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.trends.trustTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                          <div>
                            <div className="text-white font-medium">{trend.month}</div>
                            <div className="text-sm text-slate-400">
                              {formatNumber(trend.newCustomers)} new customers
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{trend.avgScore}</div>
                            <div className="text-sm text-slate-400">avg score</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-400" />
                      System Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{metrics.systemPerformance.uptime}%</div>
                        <div className="text-sm text-slate-400">System Uptime</div>
                      </div>
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatNumber(metrics.systemPerformance.throughput)}
                        </div>
                        <div className="text-sm text-slate-400">Transactions/min</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">AI Model Accuracy</span>
                          <span className="text-green-400">{metrics.systemPerformance.accuracy}%</span>
                        </div>
                        <Progress value={metrics.systemPerformance.accuracy} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">System Uptime</span>
                          <span className="text-green-400">{metrics.systemPerformance.uptime}%</span>
                        </div>
                        <Progress value={metrics.systemPerformance.uptime} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Processing Speed</span>
                          <span className="text-blue-400">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-slate-300 font-medium mb-3">Performance Benchmarks</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Response Time (Target: &lt;50ms)</span>
                          <Badge className="bg-green-600">{metrics.fraudPrevention.avgResponseTime}ms</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">False Positive Rate (Target: &lt;1%)</span>
                          <Badge className="bg-green-600">{metrics.systemPerformance.falsePositives}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Accuracy (Target: &gt;99%)</span>
                          <Badge className="bg-green-600">{metrics.systemPerformance.accuracy}%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      Performance Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 font-medium">Excellent Performance</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          System is operating at peak efficiency with 99.2% accuracy and minimal false positives.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-slate-300 font-medium">Recent Optimizations</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">
                              ML model retrained with latest fraud patterns
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">Database query optimization completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">Blockchain sync performance improved</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-slate-300 font-medium">Upcoming Improvements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">Advanced neural network deployment</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">Real-time feature engineering</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Comprehensive Trend Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Historical performance data and predictive insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-slate-300 font-medium">Key Insights</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-900/50 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-medium">Fraud Prevention</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            97.8% prevention rate maintained with 15% improvement in detection speed
                          </p>
                        </div>

                        <div className="p-3 bg-slate-900/50 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 font-medium">Trust Scores</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            Average trust score increased by 3.7 points with 12% more verified customers
                          </p>
                        </div>

                        <div className="p-3 bg-slate-900/50 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <Target className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 font-medium">System Performance</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            99.2% accuracy achieved with 0.5% improvement in precision
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-slate-300 font-medium">Predictions</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-900/20 border border-blue-500 rounded">
                          <div className="text-blue-400 font-medium mb-1">Next Month</div>
                          <p className="text-sm text-slate-300">
                            Expected 5% increase in fraud attempts during holiday season
                          </p>
                        </div>

                        <div className="p-3 bg-green-900/20 border border-green-500 rounded">
                          <div className="text-green-400 font-medium mb-1">Q1 2024</div>
                          <p className="text-sm text-slate-300">
                            Trust score improvements projected to reach 82.5 average
                          </p>
                        </div>

                        <div className="p-3 bg-purple-900/20 border border-purple-500 rounded">
                          <div className="text-purple-400 font-medium mb-1">Long Term</div>
                          <p className="text-sm text-slate-300">
                            AI model accuracy expected to reach 99.5% with new training data
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-slate-300 font-medium">Recommendations</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-900/20 border border-yellow-500 rounded">
                          <div className="text-yellow-400 font-medium mb-1">High Priority</div>
                          <p className="text-sm text-slate-300">Increase monitoring during peak shopping periods</p>
                        </div>

                        <div className="p-3 bg-orange-900/20 border border-orange-500 rounded">
                          <div className="text-orange-400 font-medium mb-1">Medium Priority</div>
                          <p className="text-sm text-slate-300">
                            Implement additional verification for new high-value customers
                          </p>
                        </div>

                        <div className="p-3 bg-slate-900/50 border border-slate-600 rounded">
                          <div className="text-slate-300 font-medium mb-1">Low Priority</div>
                          <p className="text-sm text-slate-400">
                            Consider expanding trust passport features for loyalty programs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
