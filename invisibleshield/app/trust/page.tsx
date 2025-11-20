"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, Star, Award, Crown, Gem, CheckCircle, AlertTriangle, Clock, DollarSign } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DemoController } from "@/components/demo-controller"

interface Customer {
  id: string
  name: string
  email: string
  trustScore: number
  tier: "platinum" | "gold" | "silver" | "bronze"
  totalTransactions: number
  totalSpent: number
  fraudIncidents: number
  accountAge: number
  lastActivity: string
  riskFactors: string[]
  trustFactors: {
    transactionHistory: number
    identityVerification: number
    deviceTrust: number
    behavioralAnalysis: number
    networkReputation: number
  }
}

const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    trustScore: 95,
    tier: "platinum",
    totalTransactions: 1247,
    totalSpent: 45780,
    fraudIncidents: 0,
    accountAge: 36,
    lastActivity: "2 hours ago",
    riskFactors: [],
    trustFactors: {
      transactionHistory: 98,
      identityVerification: 95,
      deviceTrust: 92,
      behavioralAnalysis: 94,
      networkReputation: 96,
    },
  },
  {
    id: "cust_002",
    name: "Michael Chen",
    email: "m.chen@email.com",
    trustScore: 87,
    tier: "gold",
    totalTransactions: 892,
    totalSpent: 32450,
    fraudIncidents: 0,
    accountAge: 24,
    lastActivity: "1 day ago",
    riskFactors: ["New device detected"],
    trustFactors: {
      transactionHistory: 89,
      identityVerification: 92,
      deviceTrust: 78,
      behavioralAnalysis: 88,
      networkReputation: 90,
    },
  },
  {
    id: "cust_003",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    trustScore: 72,
    tier: "silver",
    totalTransactions: 456,
    totalSpent: 18920,
    fraudIncidents: 1,
    accountAge: 18,
    lastActivity: "3 hours ago",
    riskFactors: ["Unusual location", "High-value transaction"],
    trustFactors: {
      transactionHistory: 75,
      identityVerification: 85,
      deviceTrust: 68,
      behavioralAnalysis: 70,
      networkReputation: 72,
    },
  },
  {
    id: "cust_004",
    name: "David Wilson",
    email: "d.wilson@email.com",
    trustScore: 58,
    tier: "bronze",
    totalTransactions: 234,
    totalSpent: 8750,
    fraudIncidents: 2,
    accountAge: 8,
    lastActivity: "5 days ago",
    riskFactors: ["Multiple failed attempts", "Suspicious patterns", "VPN usage"],
    trustFactors: {
      transactionHistory: 45,
      identityVerification: 60,
      deviceTrust: 55,
      behavioralAnalysis: 52,
      networkReputation: 48,
    },
  },
]

export default function TrustPassportPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTier, setFilterTier] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === "all" || customer.tier === filterTier
    return matchesSearch && matchesTier
  })

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Crown className="h-5 w-5 text-purple-400" />
      case "gold":
        return <Award className="h-5 w-5 text-yellow-400" />
      case "silver":
        return <Star className="h-5 w-5 text-gray-400" />
      case "bronze":
        return <Gem className="h-5 w-5 text-orange-400" />
      default:
        return <Shield className="h-5 w-5 text-slate-400" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-600"
      case "gold":
        return "bg-yellow-600"
      case "silver":
        return "bg-gray-600"
      case "bronze":
        return "bg-orange-600"
      default:
        return "bg-slate-600"
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation onStartDemo={() => setIsDemoOpen(true)} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Trust Passport System</h1>
              <p className="text-slate-300">Blockchain-based customer trust scoring and verification</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                Blockchain Verified
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {customers.length} Customers
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Customer Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={filterTier} onValueChange={setFilterTier}>
                  <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTierIcon(customer.tier)}
                      <div>
                        <CardTitle className="text-white text-lg">{customer.name}</CardTitle>
                        <CardDescription className="text-slate-400">{customer.email}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getTierColor(customer.tier)}>{customer.tier.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Trust Score</span>
                    <span className={`text-2xl font-bold ${getTrustScoreColor(customer.trustScore)}`}>
                      {customer.trustScore}
                    </span>
                  </div>
                  <Progress value={customer.trustScore} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Transactions</span>
                      <div className="text-white font-medium">{customer.totalTransactions.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Spent</span>
                      <div className="text-white font-medium">{formatCurrency(customer.totalSpent)}</div>
                    </div>
                  </div>

                  {customer.riskFactors.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">
                        {customer.riskFactors.length} Risk Factor{customer.riskFactors.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Activity</span>
                    <span className="text-slate-300">{customer.lastActivity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customer Detail Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="bg-slate-900 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTierIcon(selectedCustomer.tier)}
                      <div>
                        <CardTitle className="text-white text-xl">{selectedCustomer.name}</CardTitle>
                        <CardDescription className="text-slate-400">{selectedCustomer.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTierColor(selectedCustomer.tier)}>
                        {selectedCustomer.tier.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="trust-factors">Trust Factors</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <Shield className="h-5 w-5 mr-2 text-blue-400" />
                              Trust Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getTrustScoreColor(selectedCustomer.trustScore)}`}>
                                {selectedCustomer.trustScore}
                              </div>
                              <Progress value={selectedCustomer.trustScore} className="mt-4" />
                              <p className="text-slate-400 text-sm mt-2">
                                {selectedCustomer.trustScore >= 90
                                  ? "Excellent"
                                  : selectedCustomer.trustScore >= 70
                                    ? "Good"
                                    : selectedCustomer.trustScore >= 50
                                      ? "Fair"
                                      : "Poor"}{" "}
                                Trust Rating
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                              Financial Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total Transactions</span>
                              <span className="text-white font-medium">
                                {selectedCustomer.totalTransactions.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total Spent</span>
                              <span className="text-white font-medium">
                                {formatCurrency(selectedCustomer.totalSpent)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Fraud Incidents</span>
                              <span
                                className={selectedCustomer.fraudIncidents === 0 ? "text-green-400" : "text-red-400"}
                              >
                                {selectedCustomer.fraudIncidents}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Account Age</span>
                              <span className="text-white font-medium">{selectedCustomer.accountAge} months</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {selectedCustomer.riskFactors.length > 0 && (
                        <Card className="bg-red-900/20 border-red-500">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                              Risk Factors
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedCustomer.riskFactors.map((factor, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                  <span className="text-red-300">{factor}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="trust-factors" className="space-y-4">
                      <div className="space-y-4">
                        {Object.entries(selectedCustomer.trustFactors).map(([factor, score]) => (
                          <Card key={factor} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white capitalize">
                                  {factor.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className={`font-bold ${getTrustScoreColor(score)}`}>{score}%</span>
                              </div>
                              <Progress value={score} className="h-2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-blue-400" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <div>
                                <div className="text-white">Successful Transaction</div>
                                <div className="text-slate-400 text-sm">$127.50 • 2 hours ago</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <div>
                                <div className="text-white">Identity Verification</div>
                                <div className="text-slate-400 text-sm">Biometric scan • 1 day ago</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                              <Shield className="h-5 w-5 text-blue-400" />
                              <div>
                                <div className="text-white">Trust Score Updated</div>
                                <div className="text-slate-400 text-sm">
                                  Score increased to {selectedCustomer.trustScore} • 2 days ago
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
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
