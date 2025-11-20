"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Blocks,
  Activity,
  Shield,
  CheckCircle,
  Clock,
  Hash,
  Database,
  Network,
  Zap,
  TrendingUp,
  Server,
  Lock,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface BlockchainTransaction {
  id: string
  hash: string
  blockNumber: number
  timestamp: string
  type: "trust_update" | "fraud_record" | "verification" | "system_event"
  data: any
  gasUsed: number
  confirmations: number
  status: "pending" | "confirmed" | "failed"
}

interface BlockchainStats {
  totalBlocks: number
  totalTransactions: number
  networkHashRate: string
  avgBlockTime: number
  pendingTransactions: number
  networkNodes: number
  trustRecords: number
  fraudRecords: number
}

export default function BlockchainPage() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [stats, setStats] = useState<BlockchainStats>({
    totalBlocks: 1247856,
    totalTransactions: 5847293,
    networkHashRate: "245.7 TH/s",
    avgBlockTime: 12.3,
    pendingTransactions: 47,
    networkNodes: 247,
    trustRecords: 125847,
    fraudRecords: 2847,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Generate sample blockchain transactions
  useEffect(() => {
    const generateTransactions = () => {
      const types: Array<"trust_update" | "fraud_record" | "verification" | "system_event"> = [
        "trust_update",
        "fraud_record",
        "verification",
        "system_event",
      ]

      const sampleTransactions: BlockchainTransaction[] = []

      for (let i = 0; i < 20; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const blockNumber = Math.floor(Math.random() * 1000) + 1247000

        sampleTransactions.push({
          id: `tx_${Date.now()}_${i}`,
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          blockNumber,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          type,
          data: generateTransactionData(type),
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
          confirmations: Math.floor(Math.random() * 100) + 1,
          status: Math.random() > 0.1 ? "confirmed" : Math.random() > 0.5 ? "pending" : "failed",
        })
      }

      setTransactions(
        sampleTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      )
      setIsLoading(false)
    }

    const generateTransactionData = (type: string) => {
      switch (type) {
        case "trust_update":
          return {
            customerId: `CUST-${Math.floor(Math.random() * 999)
              .toString()
              .padStart(3, "0")}`,
            oldScore: Math.floor(Math.random() * 100),
            newScore: Math.floor(Math.random() * 100),
            reason: "Transaction behavior analysis",
          }
        case "fraud_record":
          return {
            transactionId: `TXN-${Math.floor(Math.random() * 99999)}`,
            fraudType: ["Card Testing", "Account Takeover", "Fake Returns"][Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 5000) + 100,
            blocked: Math.random() > 0.3,
          }
        case "verification":
          return {
            customerId: `CUST-${Math.floor(Math.random() * 999)
              .toString()
              .padStart(3, "0")}`,
            verificationType: "Identity Verification",
            status: "Verified",
          }
        case "system_event":
          return {
            eventType: ["Model Update", "Security Patch", "Network Upgrade"][Math.floor(Math.random() * 3)],
            version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
            description: "System maintenance completed",
          }
        default:
          return {}
      }
    }

    generateTransactions()

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        pendingTransactions: Math.max(0, prev.pendingTransactions + Math.floor(Math.random() * 3) - 1),
        avgBlockTime: Math.round((prev.avgBlockTime + (Math.random() - 0.5) * 2) * 10) / 10,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "trust_update":
        return <Shield className="h-4 w-4 text-blue-400" />
      case "fraud_record":
        return <AlertDescription className="h-4 w-4 text-red-400" />
      case "verification":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "system_event":
        return <Activity className="h-4 w-4 text-purple-400" />
      default:
        return <Hash className="h-4 w-4 text-slate-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trust_update":
        return "text-blue-400"
      case "fraud_record":
        return "text-red-400"
      case "verification":
        return "text-green-400"
      case "system_event":
        return "text-purple-400"
      default:
        return "text-slate-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Blockchain Ledger</h1>
              <p className="text-xl text-slate-300">Immutable Trust & Fraud Prevention Records</p>
              <p className="text-slate-400 mt-2">
                Decentralized ledger ensuring transparency and immutability of all trust scores and fraud records
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">Network Active</span>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Blocks</CardTitle>
                <Blocks className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalBlocks.toLocaleString()}</div>
                <p className="text-xs text-slate-400">+{Math.floor(Math.random() * 10) + 1} today</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Transactions</CardTitle>
                <Database className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Real-time processing</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Network Nodes</CardTitle>
                <Network className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.networkNodes}</div>
                <p className="text-xs text-slate-400">Distributed globally</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Avg Block Time</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.avgBlockTime}s</div>
                <p className="text-xs text-slate-400">Target: 12s</p>
              </CardContent>
            </Card>
          </div>

          {/* Network Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="h-5 w-5 mr-2 text-green-400" />
                  Network Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Hash Rate</span>
                    <span className="text-white">{stats.networkHashRate}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Network Sync</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Node Consensus</span>
                    <span className="text-green-400">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>

                <Alert className="border-green-500 bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-300">
                    Network is healthy and fully operational
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Transaction Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">Trust Updates</span>
                    </div>
                    <span className="text-white">{stats.trustRecords.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-red-400" />
                      <span className="text-slate-300">Fraud Records</span>
                    </div>
                    <span className="text-white">{stats.fraudRecords.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Verifications</span>
                    </div>
                    <span className="text-white">{Math.floor(stats.totalTransactions * 0.15).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-300">System Events</span>
                    </div>
                    <span className="text-white">{Math.floor(stats.totalTransactions * 0.05).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pending Transactions</span>
                    <span className="text-yellow-400">{stats.pendingTransactions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Hash className="h-5 w-5 mr-2 text-blue-400" />
                Recent Blockchain Transactions
              </CardTitle>
              <CardDescription className="text-slate-400">
                Latest trust updates, fraud records, and system events recorded on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading blockchain transactions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="border border-slate-700 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(tx.type)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium capitalize ${getTypeColor(tx.type)}`}>
                                {tx.type.replace("_", " ")}
                              </span>
                              {getStatusBadge(tx.status)}
                            </div>
                            <div className="text-sm text-slate-400">
                              Block #{tx.blockNumber} • {tx.confirmations} confirmations
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">{new Date(tx.timestamp).toLocaleString()}</div>
                          <div className="text-xs text-slate-500">Gas: {tx.gasUsed.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Transaction Hash:</span>
                          <div className="font-mono text-blue-400 break-all">{formatHash(tx.hash)}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Data:</span>
                          <div className="text-slate-300">{JSON.stringify(tx.data, null, 0).slice(0, 100)}...</div>
                        </div>
                      </div>

                      {tx.type === "trust_update" && (
                        <div className="bg-slate-900/50 p-3 rounded text-sm">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <span className="text-slate-400">Customer:</span>
                              <div className="text-white">{tx.data.customerId}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Score Change:</span>
                              <div className="text-white">
                                {tx.data.oldScore} → {tx.data.newScore}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400">Reason:</span>
                              <div className="text-white">{tx.data.reason}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tx.type === "fraud_record" && (
                        <div className="bg-slate-900/50 p-3 rounded text-sm">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <span className="text-slate-400">Transaction:</span>
                              <div className="text-white">{tx.data.transactionId}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Fraud Type:</span>
                              <div className="text-red-400">{tx.data.fraudType}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Amount:</span>
                              <div className="text-white">${tx.data.amount.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blockchain Security */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-400" />
                Blockchain Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-blue-400 mx-auto" />
                  <h4 className="text-white font-medium">Immutable Records</h4>
                  <p className="text-sm text-slate-400">All trust scores and fraud records are permanently recorded</p>
                </div>
                <div className="text-center space-y-2">
                  <Network className="h-8 w-8 text-green-400 mx-auto" />
                  <h4 className="text-white font-medium">Decentralized</h4>
                  <p className="text-sm text-slate-400">Distributed across {stats.networkNodes} global nodes</p>
                </div>
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-purple-400 mx-auto" />
                  <h4 className="text-white font-medium">Consensus Verified</h4>
                  <p className="text-sm text-slate-400">All transactions verified by network consensus</p>
                </div>
                <div className="text-center space-y-2">
                  <Lock className="h-8 w-8 text-yellow-400 mx-auto" />
                  <h4 className="text-white font-medium">Cryptographically Secure</h4>
                  <p className="text-sm text-slate-400">Protected by advanced cryptographic algorithms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
