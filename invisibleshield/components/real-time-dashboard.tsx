"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Wifi,
  WifiOff,
  Eye,
  BlocksIcon as Block,
  Server,
  Network,
  Cpu,
  HardDrive,
} from "lucide-react"
import { useWebSocket, type WebSocketMessage } from "@/lib/websocket"
import { threatEngine, type ThreatEvent } from "@/lib/threat-intelligence"

interface SystemMetrics {
  cpu: number
  memory: number
  network: number
  activeThreats: number
  blockedThreats: number
  uptime: number
}

export function RealTimeDashboard() {
  const { isConnected, messages, connectionStatus } = useWebSocket()
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    network: 78,
    activeThreats: 0,
    blockedThreats: 0,
    uptime: 86400,
  })
  const [securityEvents, setSecurityEvents] = useState<WebSocketMessage[]>([])

  // Initialize threat detection
  useEffect(() => {
    console.log("RealTimeDashboard: Initializing threat detection...")

    const unsubscribe = threatEngine.onThreatDetected((threat: ThreatEvent) => {
      console.log("RealTimeDashboard: New threat detected", threat.id)
      setThreats((prev) => [threat, ...prev.slice(0, 19)]) // Keep last 20 threats
    })

    // Load initial threats
    const initialThreats = threatEngine.getRecentThreats(10)
    setThreats(initialThreats)
    console.log("RealTimeDashboard: Loaded", initialThreats.length, "initial threats")

    return unsubscribe
  }, [])

  // Process WebSocket messages
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[0]

      if (latestMessage.type === "system") {
        setSystemMetrics((prev) => ({
          ...prev,
          ...latestMessage.data,
          activeThreats: threats.filter((t) => !t.blocked).length,
          blockedThreats: threats.filter((t) => t.blocked).length,
        }))
      } else if (latestMessage.type === "security_event") {
        setSecurityEvents((prev) => [latestMessage, ...prev.slice(0, 9)]) // Keep last 10 events
      }
    }
  }, [messages, threats])

  // Update system metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpu: Math.round(Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)) * 10) / 10,
        memory: Math.round(Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)) * 10) / 10,
        network: Math.round(Math.max(40, Math.min(100, prev.network + (Math.random() - 0.5) * 15)) * 10) / 10,
        activeThreats: threats.filter((t) => !t.blocked).length,
        blockedThreats: threats.filter((t) => t.blocked).length,
        uptime: prev.uptime + 2,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [threats])

  const handleBlockIP = async (source: string) => {
    try {
      console.log("Blocking IP:", source)
      // Find and block the threat
      const threat = threats.find((t) => t.source === source)
      if (threat) {
        threatEngine.blockThreat(threat.id)
        setThreats((prev) =>
          prev.map((t) =>
            t.source === source ? { ...t, blocked: true, mitigation: "Manually blocked by security team" } : t,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to block IP:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-blue-400"
      default:
        return "text-slate-400"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-600">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-600">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  // Format numbers to 1 decimal place
  const formatMetric = (value: number) => {
    return Math.round(value * 10) / 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invisible Shield Dashboard</h1>
            <p className="text-slate-300">Real-time cybersecurity monitoring and threat detection</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status Alert */}
        <Alert
          className={`border-l-4 ${isConnected ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"}`}
        >
          <Activity className="h-4 w-4" />
          <AlertDescription className="text-white">
            Real-time monitoring: {isConnected ? "Connected" : "Disconnected"} • {messages.length} messages received
          </AlertDescription>
        </Alert>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatMetric(systemMetrics.cpu)}%</div>
              <Progress value={systemMetrics.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatMetric(systemMetrics.memory)}%</div>
              <Progress value={systemMetrics.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Network</CardTitle>
              <Network className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatMetric(systemMetrics.network)}%</div>
              <Progress value={systemMetrics.network} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{systemMetrics.activeThreats}</div>
              <p className="text-xs text-slate-400">Real-time detection</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Blocked</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{systemMetrics.blockedThreats}</div>
              <p className="text-xs text-slate-400">Threats mitigated</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Threat Feed */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-red-400" />
                Live Threat Feed
              </CardTitle>
              <CardDescription className="text-slate-400">Real-time security threats and attacks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {threats.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Monitoring for threats...</p>
                </div>
              ) : (
                threats.map((threat) => (
                  <div key={threat.id} className="border border-slate-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSeverityBadge(threat.severity)}
                        {threat.blocked ? (
                          <Badge className="bg-green-600">BLOCKED</Badge>
                        ) : (
                          <Badge className="bg-red-600">ACTIVE</Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(threat.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{threat.type}</h4>
                      <p className="text-sm text-slate-300">
                        Source: {threat.source} ({threat.location})
                      </p>
                      <p className="text-sm text-slate-400">
                        Confidence: {threat.confidence}% • {threat.patterns.join(", ")}
                      </p>
                    </div>
                    {!threat.blocked && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBlockIP(threat.source)}
                        className="w-full"
                      >
                        <Block className="h-4 w-4 mr-2" />
                        Block IP
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Security Events Feed */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Security Events Feed
              </CardTitle>
              <CardDescription className="text-slate-400">Real-time security monitoring and analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {securityEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Monitoring security events...</p>
                </div>
              ) : (
                securityEvents.map((event) => (
                  <div key={event.id} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white font-medium">{event.data.event}</span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                      <p>Source: {event.data.source}</p>
                      <p>Action: {event.data.action}</p>
                      <p className="text-slate-400">{event.data.details}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">System Health</h4>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">All systems operational</span>
                </div>
                <p className="text-sm text-slate-400">Uptime: {formatUptime(systemMetrics.uptime)}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">Threat Detection</h4>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Active monitoring</span>
                </div>
                <p className="text-sm text-slate-400">{threats.length} threats detected today</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">Network Security</h4>
                <div className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Protected</span>
                </div>
                <p className="text-sm text-slate-400">Firewall active, {systemMetrics.blockedThreats} IPs blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
