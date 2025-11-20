"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Bell, Search, Plus, CheckCircle, Eye, MessageSquare, Shield, Zap, Activity } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DemoController } from "@/components/demo-controller"

interface SecurityAlert {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "investigating" | "resolved" | "dismissed"
  category: "fraud" | "security" | "system" | "compliance"
  source: string
  timestamp: string
  assignedTo?: string
  impact: "high" | "medium" | "low"
  affectedSystems: string[]
  responseActions: string[]
  notes: string[]
}

const mockAlerts: SecurityAlert[] = [
  {
    id: "alert_001",
    title: "Multiple Failed Login Attempts Detected",
    description: "Unusual pattern of failed login attempts from IP 192.168.1.100 targeting multiple user accounts",
    severity: "high",
    status: "active",
    category: "security",
    source: "Authentication System",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    impact: "medium",
    affectedSystems: ["User Authentication", "Account Management"],
    responseActions: ["IP Monitoring", "Account Lockout"],
    notes: [],
  },
  {
    id: "alert_002",
    title: "Suspicious Transaction Pattern",
    description:
      "AI detected unusual spending pattern for customer ID 12345 - multiple high-value transactions in short timeframe",
    severity: "critical",
    status: "investigating",
    category: "fraud",
    source: "AI Fraud Engine",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    assignedTo: "Security Team Alpha",
    impact: "high",
    affectedSystems: ["Payment Processing", "Customer Account"],
    responseActions: ["Transaction Hold", "Customer Verification"],
    notes: ["Customer contacted for verification", "Awaiting response"],
  },
  {
    id: "alert_003",
    title: "System Performance Degradation",
    description: "Database response times have increased by 300% in the last 15 minutes",
    severity: "medium",
    status: "resolved",
    category: "system",
    source: "Performance Monitor",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    assignedTo: "DevOps Team",
    impact: "medium",
    affectedSystems: ["Database Cluster", "API Gateway"],
    responseActions: ["Database Optimization", "Load Balancing"],
    notes: ["Issue resolved by restarting database cluster", "Performance back to normal"],
  },
  {
    id: "alert_004",
    title: "Compliance Violation Detected",
    description: "PCI DSS compliance check failed - unencrypted card data detected in logs",
    severity: "critical",
    status: "active",
    category: "compliance",
    source: "Compliance Scanner",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    impact: "high",
    affectedSystems: ["Payment Logs", "Data Storage"],
    responseActions: ["Log Sanitization", "Encryption Review"],
    notes: [],
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [newNote, setNewNote] = useState("")

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert: SecurityAlert = {
          id: `alert_${Date.now()}`,
          title: "New Security Event Detected",
          description: "AI system detected potential security threat requiring investigation",
          severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)] as any,
          status: "active",
          category: ["fraud", "security", "system", "compliance"][Math.floor(Math.random() * 4)] as any,
          source: "AI Security Engine",
          timestamp: new Date().toISOString(),
          impact: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as any,
          affectedSystems: ["Payment System", "User Authentication"],
          responseActions: ["Investigation Required"],
          notes: [],
        }
        setAlerts((prev) => [newAlert, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesCategory = filterCategory === "all" || alert.category === filterCategory
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory
  })

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-red-600">Active</Badge>
      case "investigating":
        return <Badge className="bg-yellow-600">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-green-600">Resolved</Badge>
      case "dismissed":
        return <Badge variant="outline">Dismissed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fraud":
        return <Zap className="h-4 w-4 text-red-400" />
      case "security":
        return <Shield className="h-4 w-4 text-blue-400" />
      case "system":
        return <Activity className="h-4 w-4 text-green-400" />
      case "compliance":
        return <CheckCircle className="h-4 w-4 text-purple-400" />
      default:
        return <Bell className="h-4 w-4 text-slate-400" />
    }
  }

  const updateAlertStatus = (alertId: string, newStatus: SecurityAlert["status"]) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: newStatus } : alert)))
  }

  const addNoteToAlert = (alertId: string, note: string) => {
    if (!note.trim()) return

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, notes: [...alert.notes, `${new Date().toLocaleString()}: ${note}`] } : alert,
      ),
    )
    setNewNote("")
  }

  const activeAlerts = alerts.filter((a) => a.status === "active").length
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "active").length
  const investigatingAlerts = alerts.filter((a) => a.status === "investigating").length
  const resolvedToday = alerts.filter(
    (a) => a.status === "resolved" && new Date(a.timestamp).toDateString() === new Date().toDateString(),
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation onStartDemo={() => setIsDemoOpen(true)} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Security Alerts Center</h1>
              <p className="text-slate-300">Centralized security alert management and response</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Security Alert</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Manually create a security alert for investigation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Alert title" className="bg-slate-700 border-slate-600 text-white" />
                  <Textarea placeholder="Alert description" className="bg-slate-700 border-slate-600 text-white" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Create Alert</Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Alert Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{activeAlerts}</div>
                <p className="text-xs text-slate-400">Requiring attention</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Critical Alerts</CardTitle>
                <Zap className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{criticalAlerts}</div>
                <p className="text-xs text-slate-400">High priority</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Investigating</CardTitle>
                <Eye className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{investigatingAlerts}</div>
                <p className="text-xs text-slate-400">Under review</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{resolvedToday}</div>
                <p className="text-xs text-slate-400">Successfully handled</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Alert Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No alerts match your current filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border cursor-pointer hover:bg-slate-700/30 transition-colors ${getSeverityColor(alert.severity)}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(alert.category)}
                        <div>
                          <h3 className="text-white font-semibold text-lg">{alert.title}</h3>
                          <p className="text-slate-300 text-sm mt-1">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Source:</span>
                        <div className="text-white">{alert.source}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Impact:</span>
                        <div className="text-white capitalize">{alert.impact}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Assigned To:</span>
                        <div className="text-white">{alert.assignedTo || "Unassigned"}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Time:</span>
                        <div className="text-white">{new Date(alert.timestamp).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>{alert.affectedSystems.length} systems affected</span>
                        <span>{alert.responseActions.length} actions taken</span>
                        {alert.notes.length > 0 && (
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {alert.notes.length} notes
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {alert.status === "active" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateAlertStatus(alert.id, "investigating")
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Start Investigation
                          </Button>
                        )}
                        {alert.status === "investigating" && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateAlertStatus(alert.id, "resolved")
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Alert Detail Modal */}
          {selectedAlert && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="bg-slate-900 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(selectedAlert.category)}
                      <div>
                        <CardTitle className="text-white text-xl">{selectedAlert.title}</CardTitle>
                        <CardDescription className="text-slate-400">
                          Alert ID: {selectedAlert.id} • {selectedAlert.source}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAlert(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Alert Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Severity:</span>
                            {getSeverityBadge(selectedAlert.severity)}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            {getStatusBadge(selectedAlert.status)}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Category:</span>
                            <span className="text-white capitalize">{selectedAlert.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Impact:</span>
                            <span className="text-white capitalize">{selectedAlert.impact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Created:</span>
                            <span className="text-white">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Description</h4>
                        <p className="text-slate-300 text-sm">{selectedAlert.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Affected Systems</h4>
                        <div className="space-y-1">
                          {selectedAlert.affectedSystems.map((system, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-blue-400" />
                              <span className="text-slate-300 text-sm">{system}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Response Actions</h4>
                        <div className="space-y-1">
                          {selectedAlert.responseActions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-slate-300 text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Investigation Notes</h4>
                    <div className="space-y-3">
                      {selectedAlert.notes.length === 0 ? (
                        <p className="text-slate-400 text-sm">No notes added yet</p>
                      ) : (
                        selectedAlert.notes.map((note, index) => (
                          <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-300 text-sm">{note}</p>
                          </div>
                        ))
                      )}

                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Add investigation note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Button onClick={() => addNoteToAlert(selectedAlert.id, newNote)} disabled={!newNote.trim()}>
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {selectedAlert.status === "active" && (
                      <Button
                        onClick={() => {
                          updateAlertStatus(selectedAlert.id, "investigating")
                          setSelectedAlert({ ...selectedAlert, status: "investigating" })
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Start Investigation
                      </Button>
                    )}
                    {selectedAlert.status === "investigating" && (
                      <Button
                        onClick={() => {
                          updateAlertStatus(selectedAlert.id, "resolved")
                          setSelectedAlert({ ...selectedAlert, status: "resolved" })
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateAlertStatus(selectedAlert.id, "dismissed")
                        setSelectedAlert(null)
                      }}
                    >
                      Dismiss Alert
                    </Button>
                  </div>
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
