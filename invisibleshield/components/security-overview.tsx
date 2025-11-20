"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Brain, Blocks, Activity, CheckCircle, AlertTriangle, Lock } from "lucide-react"

export function SecurityOverview() {
  const securityMetrics = [
    {
      component: "AI Fraud Engine",
      status: "Operational",
      uptime: 99.97,
      lastUpdate: "2 hours ago",
      version: "v2.1.4",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      component: "Blockchain Network",
      status: "Operational",
      uptime: 99.99,
      lastUpdate: "Live",
      version: "v1.8.2",
      icon: Blocks,
      color: "text-blue-400",
    },
    {
      component: "Trust Passport",
      status: "Operational",
      uptime: 99.95,
      lastUpdate: "5 minutes ago",
      version: "v3.0.1",
      icon: Shield,
      color: "text-green-400",
    },
    {
      component: "Real-time Monitor",
      status: "Operational",
      uptime: 99.98,
      lastUpdate: "Live",
      version: "v1.5.3",
      icon: Activity,
      color: "text-yellow-400",
    },
  ]

  const threatIntelligence = [
    {
      threat: "Unauthorized Access Attempts",
      level: "Medium",
      blocked: 23,
      trend: "↓ 15%",
    },
    {
      threat: "Suspicious Network Activity",
      level: "High",
      blocked: 45,
      trend: "↑ 8%",
    },
    {
      threat: "Malware Detection",
      level: "Critical",
      blocked: 12,
      trend: "↓ 32%",
    },
    {
      threat: "Data Access Anomalies",
      level: "Low",
      blocked: 67,
      trend: "↓ 5%",
    },
  ]

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-400 border-red-400"
      case "High":
        return "text-orange-400 border-orange-400"
      case "Medium":
        return "text-yellow-400 border-yellow-400"
      case "Low":
        return "text-green-400 border-green-400"
      default:
        return "text-slate-400 border-slate-400"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="h-5 w-5 mr-2 text-green-400" />
            System Security Status
          </CardTitle>
          <CardDescription className="text-slate-400">Real-time status of all security components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div>
                    <div className="text-white font-medium">{metric.component}</div>
                    <div className="text-slate-400 text-sm">
                      {metric.version} • Updated {metric.lastUpdate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 mb-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {metric.status}
                  </Badge>
                  <div className="text-slate-400 text-sm">{metric.uptime}% uptime</div>
                </div>
              </div>
            )
          })}

          <Alert className="bg-green-900/20 border-green-600">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              All security systems are operational and performing within normal parameters.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
            Threat Intelligence
          </CardTitle>
          <CardDescription className="text-slate-400">Current threat landscape and prevention metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatIntelligence.map((threat, index) => (
            <div key={index} className="p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium">{threat.threat}</div>
                <Badge variant="outline" className={getThreatColor(threat.level)}>
                  {threat.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-400">
                  Blocked today: <span className="text-white font-semibold">{threat.blocked}</span>
                </div>
                <div className={`font-medium ${threat.trend.startsWith("↓") ? "text-green-400" : "text-red-400"}`}>
                  {threat.trend}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Overall Threat Level</span>
              <Badge className="bg-yellow-600">ELEVATED</Badge>
            </div>
            <Progress value={65} className="mb-2" />
            <div className="text-xs text-slate-400">Increased activity detected in payment fraud attempts</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
