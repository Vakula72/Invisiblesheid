"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  User,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  Star,
  Award,
  Lock,
} from "lucide-react"

interface TrustProfile {
  customerId: string
  name: string
  email: string
  trustScore: number
  riskLevel: "low" | "medium" | "high"
  accountAge: number
  totalTransactions: number
  successfulTransactions: number
  averageOrderValue: number
  lastActivity: string
  verificationStatus: "verified" | "pending" | "unverified"
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum"
  flags: string[]
  trustFactors: {
    paymentHistory: number
    accountStability: number
    behaviorPattern: number
    deviceTrust: number
    locationConsistency: number
  }
  recentActivity: Array<{
    date: string
    action: string
    amount?: number
    status: "success" | "flagged" | "blocked"
  }>
}

export function TrustPassport() {
  const [searchId, setSearchId] = useState("")
  const [profile, setProfile] = useState<TrustProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Sample trust profiles
  const sampleProfiles: Record<string, TrustProfile> = {
    "CUST-001": {
      customerId: "CUST-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      trustScore: 87,
      riskLevel: "low",
      accountAge: 24,
      totalTransactions: 156,
      successfulTransactions: 154,
      averageOrderValue: 89.5,
      lastActivity: "2024-01-15T14:30:00Z",
      verificationStatus: "verified",
      loyaltyTier: "gold",
      flags: [],
      trustFactors: {
        paymentHistory: 95,
        accountStability: 88,
        behaviorPattern: 82,
        deviceTrust: 90,
        locationConsistency: 85,
      },
      recentActivity: [
        { date: "2024-01-15", action: "Purchase", amount: 125.99, status: "success" },
        { date: "2024-01-14", action: "Return", amount: 45.0, status: "success" },
        { date: "2024-01-13", action: "Purchase", amount: 67.5, status: "success" },
        { date: "2024-01-12", action: "Login", status: "success" },
        { date: "2024-01-11", action: "Purchase", amount: 234.99, status: "success" },
      ],
    },
    "CUST-002": {
      customerId: "CUST-002",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      trustScore: 34,
      riskLevel: "high",
      accountAge: 2,
      totalTransactions: 23,
      successfulTransactions: 18,
      averageOrderValue: 245.0,
      lastActivity: "2024-01-15T13:45:00Z",
      verificationStatus: "pending",
      loyaltyTier: "bronze",
      flags: ["High-value transactions", "New account", "Unusual purchase pattern"],
      trustFactors: {
        paymentHistory: 45,
        accountStability: 25,
        behaviorPattern: 30,
        deviceTrust: 40,
        locationConsistency: 35,
      },
      recentActivity: [
        { date: "2024-01-15", action: "Purchase", amount: 2500.0, status: "flagged" },
        { date: "2024-01-14", action: "Purchase", amount: 1800.0, status: "blocked" },
        { date: "2024-01-13", action: "Account Update", status: "success" },
        { date: "2024-01-12", action: "Purchase", amount: 150.0, status: "success" },
        { date: "2024-01-11", action: "Registration", status: "success" },
      ],
    },
    "CUST-003": {
      customerId: "CUST-003",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      trustScore: 92,
      riskLevel: "low",
      accountAge: 36,
      totalTransactions: 342,
      successfulTransactions: 340,
      averageOrderValue: 67.25,
      lastActivity: "2024-01-15T15:20:00Z",
      verificationStatus: "verified",
      loyaltyTier: "platinum",
      flags: [],
      trustFactors: {
        paymentHistory: 98,
        accountStability: 95,
        behaviorPattern: 90,
        deviceTrust: 88,
        locationConsistency: 92,
      },
      recentActivity: [
        { date: "2024-01-15", action: "Loyalty Redemption", amount: 89.99, status: "success" },
        { date: "2024-01-14", action: "Purchase", amount: 45.5, status: "success" },
        { date: "2024-01-13", action: "Purchase", amount: 123.75, status: "success" },
        { date: "2024-01-12", action: "Review Submitted", status: "success" },
        { date: "2024-01-11", action: "Purchase", amount: 78.25, status: "success" },
      ],
    },
  }

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a customer ID")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const foundProfile = sampleProfiles[searchId.toUpperCase()]
      if (foundProfile) {
        setProfile(foundProfile)
        setError("")
      } else {
        setProfile(null)
        setError("Customer not found. Try CUST-001, CUST-002, or CUST-003")
      }
      setIsLoading(false)
    }, 1000)
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Trusted</Badge>
    if (score >= 60) return <Badge className="bg-yellow-600">Moderate</Badge>
    if (score >= 40) return <Badge className="bg-orange-600">Caution</Badge>
    return <Badge className="bg-red-600">High Risk</Badge>
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getLoyaltyIcon = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Award className="h-4 w-4 text-purple-400" />
      case "gold":
        return <Award className="h-4 w-4 text-yellow-400" />
      case "silver":
        return <Award className="h-4 w-4 text-slate-400" />
      default:
        return <Star className="h-4 w-4 text-orange-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-400" />
            Customer Trust Lookup
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter a customer ID to view their blockchain-verified trust passport
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="customerId" className="text-slate-300">
                Customer ID
              </Label>
              <Input
                id="customerId"
                placeholder="Enter customer ID (e.g., CUST-001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-500 bg-red-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-slate-400">
            <p>Try these sample customer IDs:</p>
            <div className="flex space-x-4 mt-2">
              <Button variant="outline" size="sm" onClick={() => setSearchId("CUST-001")}>
                CUST-001
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchId("CUST-002")}>
                CUST-002
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchId("CUST-003")}>
                CUST-003
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Profile */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Customer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                <p className="text-slate-400">{profile.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {getLoyaltyIcon(profile.loyaltyTier)}
                  <span className="text-slate-300 capitalize">{profile.loyaltyTier} Member</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer ID:</span>
                  <span className="text-white font-mono">{profile.customerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Age:</span>
                  <span className="text-white">{profile.accountAge} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification:</span>
                  <div className="flex items-center space-x-1">
                    {profile.verificationStatus === "verified" ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-white capitalize">{profile.verificationStatus}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Activity:</span>
                  <span className="text-white">{new Date(profile.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>

              {profile.flags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-slate-300 font-medium">Security Flags</h4>
                  {profile.flags.map((flag, index) => (
                    <Badge key={index} variant="destructive" className="mr-2 mb-2">
                      {flag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Score */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getTrustScoreColor(profile.trustScore)} mb-2`}>
                  {profile.trustScore}
                </div>
                <div className="flex justify-center mb-4">{getTrustScoreBadge(profile.trustScore)}</div>
                <Progress value={profile.trustScore} className="mb-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className={`font-medium capitalize ${getRiskLevelColor(profile.riskLevel)}`}>
                    {profile.riskLevel}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium">Trust Factors</h4>
                {Object.entries(profile.trustFactors).map(([factor, score]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 capitalize">{factor.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-white">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-400" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{profile.totalTransactions}</div>
                  <div className="text-sm text-slate-400">Total Transactions</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{profile.successfulTransactions}</div>
                  <div className="text-sm text-slate-400">Successful</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate:</span>
                  <span className="text-green-400">
                    {Math.round((profile.successfulTransactions / profile.totalTransactions) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Order Value:</span>
                  <span className="text-white">${profile.averageOrderValue.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-slate-300 font-medium">Recent Activity</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <div>
                          <div className="text-sm text-white">{activity.action}</div>
                          <div className="text-xs text-slate-400">{activity.date}</div>
                        </div>
                      </div>
                      {activity.amount && <div className="text-sm text-white">${activity.amount.toFixed(2)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blockchain Verification */}
      {profile && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-400" />
              Blockchain Verification
            </CardTitle>
            <CardDescription className="text-slate-400">
              Trust score verified and recorded on immutable blockchain ledger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">Trust Hash</h4>
                <div className="font-mono text-sm text-blue-400 bg-slate-900/50 p-2 rounded">
                  0x{Math.random().toString(16).substr(2, 40)}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">Block Number</h4>
                <div className="font-mono text-sm text-white bg-slate-900/50 p-2 rounded">
                  #{Math.floor(Math.random() * 1000000) + 1000000}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-300 font-medium">Last Updated</h4>
                <div className="text-sm text-white bg-slate-900/50 p-2 rounded">{new Date().toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
