"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface Report {
  id: string
  title: string
  type: "fraud_summary" | "trust_analysis" | "performance" | "compliance" | "executive"
  period: string
  generatedAt: string
  status: "ready" | "generating" | "scheduled"
  size: string
  description: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  recipients: string[]
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "RPT-001",
      title: "Monthly Fraud Prevention Summary",
      type: "fraud_summary",
      period: "December 2024",
      generatedAt: "2024-01-15T09:00:00Z",
      status: "ready",
      size: "2.4 MB",
      description: "Comprehensive analysis of fraud detection and prevention activities",
    },
    {
      id: "RPT-002",
      title: "Trust Score Analytics Report",
      type: "trust_analysis",
      period: "Q4 2024",
      generatedAt: "2024-01-14T16:30:00Z",
      status: "ready",
      size: "1.8 MB",
      description: "Customer trust score trends and blockchain verification metrics",
    },
    {
      id: "RPT-003",
      title: "System Performance Dashboard",
      type: "performance",
      period: "Last 30 Days",
      generatedAt: "2024-01-15T08:00:00Z",
      status: "ready",
      size: "3.1 MB",
      description: "AI model performance, system uptime, and processing metrics",
    },
    {
      id: "RPT-004",
      title: "Compliance Audit Report",
      type: "compliance",
      period: "2024 Annual",
      generatedAt: "2024-01-10T14:00:00Z",
      status: "ready",
      size: "5.2 MB",
      description: "Regulatory compliance status and audit trail documentation",
    },
    {
      id: "RPT-005",
      title: "Executive Summary - January",
      type: "executive",
      period: "January 2024",
      generatedAt: "2024-01-15T10:00:00Z",
      status: "generating",
      size: "Pending",
      description: "High-level overview for executive leadership team",
    },
  ])

  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: "TPL-001",
      name: "Daily Fraud Alert Summary",
      description: "Daily summary of fraud attempts and prevention actions",
      type: "fraud_summary",
      frequency: "daily",
      recipients: ["security@company.com", "ops@company.com"],
    },
    {
      id: "TPL-002",
      name: "Weekly Trust Score Report",
      description: "Weekly analysis of customer trust score changes",
      type: "trust_analysis",
      frequency: "weekly",
      recipients: ["analytics@company.com", "customer-success@company.com"],
    },
    {
      id: "TPL-003",
      name: "Monthly Executive Dashboard",
      description: "Monthly high-level metrics for executive team",
      type: "executive",
      frequency: "monthly",
      recipients: ["executives@company.com", "board@company.com"],
    },
  ])

  const [selectedPeriod, setSelectedPeriod] = useState("last30days")
  const [selectedType, setSelectedType] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const getReportIcon = (type: string) => {
    switch (type) {
      case "fraud_summary":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "trust_analysis":
        return <Users className="h-4 w-4 text-blue-400" />
      case "performance":
        return <BarChart3 className="h-4 w-4 text-green-400" />
      case "compliance":
        return <Shield className="h-4 w-4 text-purple-400" />
      case "executive":
        return <TrendingUp className="h-4 w-4 text-yellow-400" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-600">Ready</Badge>
      case "generating":
        return <Badge className="bg-yellow-600">Generating</Badge>
      case "scheduled":
        return <Badge className="bg-blue-600">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fraud_summary":
        return "text-red-400"
      case "trust_analysis":
        return "text-blue-400"
      case "performance":
        return "text-green-400"
      case "compliance":
        return "text-purple-400"
      case "executive":
        return "text-yellow-400"
      default:
        return "text-slate-400"
    }
  }

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
        title: `Custom ${type.replace("_", " ")} Report`,
        type: type as any,
        period: selectedPeriod,
        generatedAt: new Date().toISOString(),
        status: "ready",
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        description: `Generated report for ${selectedPeriod} period`,
      }

      setReports((prev) => [newReport, ...prev])
      setIsGenerating(false)
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`)
    // In a real implementation, this would trigger a file download
  }

  const filteredReports = reports.filter((report) => {
    if (selectedType === "all") return true
    return report.type === selectedType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Security Reports</h1>
              <p className="text-xl text-slate-300">Automated Fraud Prevention Analytics</p>
              <p className="text-slate-400 mt-2">
                Generate comprehensive reports on fraud prevention, trust analytics, and system performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">{reports.length} Reports Available</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{reports.length}</div>
                <p className="text-xs text-slate-400">+3 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Ready to Download</CardTitle>
                <Download className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {reports.filter((r) => r.status === "ready").length}
                </div>
                <p className="text-xs text-slate-400">Available now</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Scheduled Reports</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{templates.length}</div>
                <p className="text-xs text-slate-400">Automated templates</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Size</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12.5 MB</div>
                <p className="text-xs text-slate-400">All reports combined</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
                Available Reports
              </TabsTrigger>
              <TabsTrigger value="generate" className="data-[state=active]:bg-blue-600">
                Generate New
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
                Automated Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-blue-400" />
                    Filter Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="period" className="text-slate-300">
                        Time Period
                      </Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="last90days">Last 90 Days</SelectItem>
                          <SelectItem value="thisyear">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="type" className="text-slate-300">
                        Report Type
                      </Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="fraud_summary">Fraud Summary</SelectItem>
                          <SelectItem value="trust_analysis">Trust Analysis</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getReportIcon(report.type)}
                          <div>
                            <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                            <p className="text-sm text-slate-400">{report.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                              <span>Period: {report.period}</span>
                              <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                              <span>Size: {report.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(report.status)}
                          {report.status === "ready" && (
                            <Button
                              onClick={() => handleDownloadReport(report.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                          {report.status === "generating" && (
                            <Button disabled className="bg-slate-600">
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="generate" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-green-400" />
                    Generate Custom Report
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Create a new report with custom parameters and data ranges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isGenerating && (
                    <Alert className="border-blue-500 bg-blue-900/20">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <AlertDescription className="text-blue-300">
                        Generating your custom report... This may take a few minutes.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card
                      className="bg-slate-900/50 border-slate-600 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => !isGenerating && handleGenerateReport("fraud_summary")}
                    >
                      <CardContent className="p-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Fraud Summary</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          Comprehensive fraud detection and prevention analysis
                        </p>
                        <Button className="w-full bg-red-600 hover:bg-red-700" disabled={isGenerating}>
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-slate-900/50 border-slate-600 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => !isGenerating && handleGenerateReport("trust_analysis")}
                    >
                      <CardContent className="p-6 text-center">
                        <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Trust Analysis</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          Customer trust scores and blockchain verification metrics
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isGenerating}>
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-slate-900/50 border-slate-600 hover:border-green-500 transition-colors cursor-pointer"
                      onClick={() => !isGenerating && handleGenerateReport("performance")}
                    >
                      <CardContent className="p-6 text-center">
                        <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          System performance, uptime, and processing metrics
                        </p>
                        <Button className="w-full bg-green-600 hover:bg-green-700" disabled={isGenerating}>
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-slate-900/50 border-slate-600 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => !isGenerating && handleGenerateReport("compliance")}
                    >
                      <CardContent className="p-6 text-center">
                        <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
                        <p className="text-sm text-slate-400 mb-4">
                          Regulatory compliance and audit trail documentation
                        </p>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={isGenerating}>
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>

                    <Card
                      className="bg-slate-900/50 border-slate-600 hover:border-yellow-500 transition-colors cursor-pointer"
                      onClick={() => !isGenerating && handleGenerateReport("executive")}
                    >
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Executive Summary</h3>
                        <p className="text-sm text-slate-400 mb-4">High-level overview for executive leadership team</p>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700" disabled={isGenerating}>
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-600 hover:border-slate-500 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Custom Report</h3>
                        <p className="text-sm text-slate-400 mb-4">Build a custom report with specific parameters</p>
                        <Button variant="outline" className="w-full border-slate-600 bg-transparent" disabled>
                          Coming Soon
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                    Automated Report Templates
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure automated reports to be generated and delivered on schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="bg-slate-900/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                              <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <span>Frequency: {template.frequency}</span>
                                <span>Recipients: {template.recipients.length}</span>
                                <span className={getTypeColor(template.type)}>
                                  Type: {template.type.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-600">Active</Badge>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Create New Template
                    </Button>
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
