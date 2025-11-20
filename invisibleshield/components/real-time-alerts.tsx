"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, AlertTriangle, Shield, Eye, X, CheckCircle } from "lucide-react"

interface SecurityAlert {
  id: string
  type: "security" | "suspicious" | "system" | "trust"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: string
  customer?: string
  amount?: number
  location?: string
  status: "active" | "investigating" | "resolved"
  actions: string[]
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: "ALERT-001",
      type: "security",
      severity: "critical",
      title: "Unauthorized Access Attempt Detected",
      description: "Multiple failed login attempts from suspicious IP address",
      timestamp: "2024-01-15 14:35:22",
      customer: "Unknown User",
      location: "Miami, FL",
      status: "active",
      actions: ["Block IP", "Investigate", "Contact Security Team"],
    },
    {
      id: "ALERT-002",
      type: "suspicious",
      severity: "high",
      title: "Unusual System Access Pattern",
      description: "User accessing system resources outside normal hours",
      timestamp: "2024-01-15 14:28:15",
      customer: "Mike Wilson",
      location: "Chicago, IL",
      status: "investigating",
      actions: ["Review Access", "Verify Identity", "Monitor Activity"],
    },
    {
      id: "ALERT-003",
      type: "trust",
      severity: "medium",
      title: "Trust Score Anomaly",
      description: "Previously trusted user showing unusual behavioral changes",
      timestamp: "2024-01-15 14:22:08",
      customer: "Sarah Johnson",
      location: "New York, NY",
      status: "active",
      actions: ["Review Account", "Additional Verification", "Monitor Closely"],
    },
    {
      id: "ALERT-004",
      type: "system",
      severity: "low",
      title: "AI Model Performance Dip",
      description: "Fraud detection accuracy dropped to 94.2% in the last hour",
      timestamp: "2024-01-15 14:15:33",
      status: "resolved",
      actions: ["Model Retrain", "Check Data Quality", "System Diagnostics"],
    },
  ])

  const [alertStats, setAlertStats] = useState({
    total: 47,
    critical: 3,
    high: 8,
    medium: 15,
    low: 21,
    resolved: 156,
  })

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alertTypes = ["security", "suspicious", "trust", "system"] as const
        const severities = ["low", "medium", "high", "critical"] as const
        const customers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"]
        const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"]

        const newAlert = {
          id: `ALERT-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: "Security Alert Detected",
          description: "Automated system has detected suspicious activity requiring attention",
          timestamp: new Date().toLocaleString(),
          customer: Math.random() > 0.3 ? customers[Math.floor(Math.random() * customers.length)] : undefined,
          location: locations[Math.floor(Math.random() * locations.length)],
          status: "active",
          actions: ["Investigate", "Review", "Take Action"],
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
        setAlertStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          [newAlert.severity]: prev[newAlert.severity] + 1,
        }))
      }
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-orange-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "suspicious":
        return <Eye className="h-4 w-4" />
      case "trust":
        return <Shield className="h-4 w-4" />
      case "system":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alertStats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{alertStats.critical}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{alertStats.high}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Medium</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{alertStats.medium}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Low</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{alertStats.low}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{alertStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="h-5 w-5 mr-2 text-red-400" />
            Active Security Alerts
          </CardTitle>
          <CardDescription className="text-slate-400">
            Real-time security incidents requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts
              .filter((alert) => alert.status !== "resolved")
              .map((alert) => (
                <Alert key={alert.id} className="bg-slate-900/50 border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getTypeIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-semibold">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                          <Badge
                            variant="outline"
                            className={
                              alert.status === "active"
                                ? "text-red-400 border-red-400"
                                : alert.status === "investigating"
                                  ? "text-yellow-400 border-yellow-400"
                                  : "text-green-400 border-green-400"
                            }
                          >
                            {alert.status.toUpperCase()}
                          </Badge>
                        </div>
                        <AlertDescription className="text-slate-300 mb-3">{alert.description}</AlertDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-slate-400">Time:</span>
                            <span className="text-white ml-1">{alert.timestamp}</span>
                          </div>
                          {alert.customer && (
                            <div>
                              <span className="text-slate-400">Customer:</span>
                              <span className="text-white ml-1">{alert.customer}</span>
                            </div>
                          )}
                          {alert.amount && (
                            <div>
                              <span className="text-slate-400">Amount:</span>
                              <span className="text-white ml-1">${alert.amount.toLocaleString()}</span>
                            </div>
                          )}
                          {alert.location && (
                            <div>
                              <span className="text-slate-400">Location:</span>
                              <span className="text-white ml-1">{alert.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {alert.actions.map((action, index) => (
                            <Button key={index} variant="outline" size="sm" className="border-slate-600 bg-transparent">
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="border-green-600 text-green-400 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="border-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Alert Response Protocols</CardTitle>
          <CardDescription className="text-slate-400">
            Automated and manual response procedures for different alert types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Automated Responses</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300">Transaction blocking for critical fraud alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300">Account flagging for suspicious behavior</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300">Trust score adjustments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-slate-300">Notification to security team</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Manual Review Required</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">High-value transaction verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Customer identity confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Complex fraud pattern analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Law enforcement coordination</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
