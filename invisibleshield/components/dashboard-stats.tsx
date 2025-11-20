"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, TrendingUp, Users, Activity, Zap } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    activeAlerts: 3,
    trustScore: 87,
    blockedTransactions: 24,
    savings: 2400000,
    totalCustomers: 24847,
    fraudPrevention: 97.8,
    processingSpeed: 47,
    networkUptime: 99.9,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1),
        trustScore: Math.min(100, Math.max(0, prev.trustScore + Math.floor(Math.random() * 6) - 2)),
        blockedTransactions: prev.blockedTransactions + Math.floor(Math.random() * 2),
        savings: prev.savings + Math.floor(Math.random() * 10000),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      description: "Security incidents detected",
      icon: AlertTriangle,
      color: "text-red-400",
      trend: null,
    },
    {
      title: "Trust Score",
      value: `${stats.trustScore}%`,
      description: "Average customer trust level",
      icon: TrendingUp,
      color: "text-green-400",
      trend: "+2.3% from last week",
      progress: stats.trustScore,
    },
    {
      title: "Security Events",
      value: stats.blockedTransactions,
      description: "Security events handled today",
      icon: Shield,
      color: "text-blue-400",
      trend: "+15% from yesterday",
    },
    {
      title: "System Health",
      value: `${stats.networkUptime}%`,
      description: "Overall system availability",
      icon: Activity,
      color: "text-green-400",
      trend: "99.9% SLA maintained",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      description: "Active trust passports",
      icon: Users,
      color: "text-blue-400",
      trend: "+1.2% growth",
    },
    {
      title: "Response Time",
      value: `${stats.processingSpeed}ms`,
      description: "Average system response",
      icon: Zap,
      color: "text-yellow-400",
      trend: "Real-time processing",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              {stat.progress && <Progress value={stat.progress} className="mb-2 h-1" />}
              <p className="text-xs text-slate-400 mb-1">{stat.description}</p>
              {stat.trend && (
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                    {stat.trend}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
