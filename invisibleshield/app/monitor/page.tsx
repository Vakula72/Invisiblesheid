"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  AlertTriangle,
  Search,
  Eye,
  EyeOff,
  BlocksIcon as Block,
  CheckCircle,
  MapPin,
  Zap,
  Activity,
  Globe,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DemoController } from "@/components/demo-controller"
import { threatEngine, type ThreatEvent } from "@/lib/threat-intelligence"

export default function MonitorPage() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(true)

  // Initialize threat detection
  useEffect(() => {
    console.log("MonitorPage: Initializing threat detection...")

    const unsubscribe = threatEngine.onThreatDetected((threat: ThreatEvent) => {
      console.log("MonitorPage: New threat detected", threat.id)
      setThreats((prev) => [threat, ...prev.slice(0, 49)]) // Keep last 50 threats
    })

    // Load initial threats
    const initialThreats = threatEngine.getRecentThreats(20)
    setThreats(initialThreats)
    console.log("MonitorPage: Loaded", initialThreats.length, "initial threats")

    return unsubscribe
  }, [])

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || threat.severity === filterSeverity
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !threat.blocked) ||
      (filterStatus === "blocked" && threat.blocked)
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const handleBlockThreat = async (threatId: string) => {
    try {
      threatEngine.blockThreat(threatId)
      setThreats((prev) =>
        prev.map((t) =>
          t.id === threatId ? { ...t, blocked: true, mitigation: "Manually blocked by security team" } : t,
        ),
      )
    } catch (error) {
      console.error("Failed to block threat:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-900/20 border-red-500"
      case "high":
        return "text-orange-400 bg-orange-900/20 border-orange-500"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500"
      case "low":
        return "text-blue-400 bg-blue-900/20 border-blue-500"
      default:
        return "text-slate-400 bg-slate-900/20 border-slate-500"
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

  const activeThreats = threats.filter((t) => !t.blocked).length
  const blockedThreats = threats.filter((t) => t.blocked).length
  const criticalThreats = threats.filter((t) => t.severity === "critical" && !t.blocked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation onStartDemo={() => setIsDemoOpen(true)} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Threat Monitoring Center</h1>
              <p className="text-slate-300">Real-time AI-powered threat detection and response</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "default" : "outline"}
                className={isMonitoring ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isMonitoring ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
              </Button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Active Threats</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{activeThreats}</div>
                <p className="text-xs text-slate-400">Requiring attention</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Blocked Threats</CardTitle>
                <Shield className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{blockedThreats}</div>
                <p className="text-xs text-slate-400">Successfully mitigated</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Critical Alerts</CardTitle>
                <Zap className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{criticalThreats}</div>
                <p className="text-xs text-slate-400">High priority</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Detection Rate</CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">98.7%</div>
                <p className="text-xs text-slate-400">AI accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Status */}
          {isMonitoring && (
            <Alert className="border-green-500 bg-green-900/20">
              <Activity className="h-4 w-4" />
              <AlertDescription className="text-white">
                AI threat detection is active • Monitoring {threats.length} total threats • Last update:{" "}
                {new Date().toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Threat Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search threats by type, source, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Threat List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-400" />
                Live Threat Feed
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time threat detection and analysis • {filteredThreats.length} threats shown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredThreats.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No threats match your current filters</p>
                </div>
              ) : (
                filteredThreats.map((threat) => (
                  <Card
                    key={threat.id}
                    className={`border ${getSeverityColor(threat.severity)} cursor-pointer hover:bg-slate-700/30 transition-colors`}
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getSeverityBadge(threat.severity)}
                          {threat.blocked ? (
                            <Badge className="bg-green-600">BLOCKED</Badge>
                          ) : (
                            <Badge className="bg-red-600">ACTIVE</Badge>
                          )}
                          <span className="text-xs text-slate-400">{new Date(threat.timestamp).toLocaleString()}</span>
                        </div>
                        {!threat.blocked && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBlockThreat(threat.id)
                            }}
                          >
                            <Block className="h-4 w-4 mr-2" />
                            Block
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-lg">{threat.type}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-blue-400" />
                            <span className="text-slate-300">Source: {threat.source}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-400" />
                            <span className="text-slate-300">Location: {threat.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-purple-400" />
                            <span className="text-slate-300">Confidence: {threat.confidence}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Patterns:</span>
                          <div className="flex flex-wrap gap-1">
                            {threat.patterns.map((pattern, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {pattern}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {threat.mitigation && (
                          <div className="flex items-center space-x-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-300 text-sm">{threat.mitigation}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Threat Detail Modal */}
          {selectedThreat && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                      <div>
                        <CardTitle className="text-white text-xl">{selectedThreat.type}</CardTitle>
                        <CardDescription className="text-slate-400">Threat ID: {selectedThreat.id}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedThreat(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-400">Severity Level</span>
                        <div className="mt-1">{getSeverityBadge(selectedThreat.severity)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status</span>
                        <div className="mt-1">
                          {selectedThreat.blocked ? (
                            <Badge className="bg-green-600">BLOCKED</Badge>
                          ) : (
                            <Badge className="bg-red-600">ACTIVE</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Detection Time</span>
                        <div className="text-white mt-1">{new Date(selectedThreat.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-400">Source IP</span>
                        <div className="text-white mt-1 font-mono">{selectedThreat.source}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Location</span>
                        <div className="text-white mt-1">{selectedThreat.location}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Confidence Score</span>
                        <div className="text-white mt-1">{selectedThreat.confidence}%</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Attack Patterns</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedThreat.patterns.map((pattern, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedThreat.mitigation && (
                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-green-300 font-medium">Mitigation Applied</span>
                      </div>
                      <p className="text-green-200">{selectedThreat.mitigation}</p>
                    </div>
                  )}

                  {!selectedThreat.blocked && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          handleBlockThreat(selectedThreat.id)
                          setSelectedThreat(null)
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Block className="h-4 w-4 mr-2" />
                        Block This Threat
                      </Button>
                      <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Create Alert
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <DemoController isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  )
}
