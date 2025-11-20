"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Blocks, Activity, Clock, CheckCircle, Hash, Database, Network, Zap, TrendingUp, Shield } from "lucide-react"

interface Block {
  number: number
  hash: string
  parentHash: string
  timestamp: string
  transactions: number
  gasUsed: number
  gasLimit: number
  miner: string
  difficulty: string
  size: number
  status: "confirmed" | "pending"
}

interface NetworkStats {
  blockHeight: number
  hashRate: string
  difficulty: string
  avgBlockTime: number
  pendingTransactions: number
  networkNodes: number
  totalSupply: string
}

const mockBlocks: Block[] = [
  {
    number: 1000847,
    hash: "0x7d4a8b9c2e1f3a6b8d9e2f4a7c5b8e1d3f6a9c2e5b8d1f4a7c9e2b5d8f1a4c7e",
    parentHash: "0x6c3a7b8c1d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    timestamp: "2024-01-13T10:30:00Z",
    transactions: 247,
    gasUsed: 8945672,
    gasLimit: 15000000,
    miner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    difficulty: "2.5T",
    size: 45678,
    status: "confirmed",
  },
  {
    number: 1000846,
    hash: "0x6c3a7b8c1d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    parentHash: "0x5b2a6b7c0c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    timestamp: "2024-01-13T10:15:00Z",
    transactions: 189,
    gasUsed: 7234561,
    gasLimit: 15000000,
    miner: "0x853e46Dd7645D1643C0643C0532925a3b8D4C053",
    difficulty: "2.5T",
    size: 38942,
    status: "confirmed",
  },
  {
    number: 1000845,
    hash: "0x5b2a6b7c0c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    parentHash: "0x4a1a5b6c9b8c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    timestamp: "2024-01-13T10:00:00Z",
    transactions: 312,
    gasUsed: 9876543,
    gasLimit: 15000000,
    miner: "0x964f57Ee8756E1754D1754D0643C0532925a3b8D",
    difficulty: "2.5T",
    size: 52341,
    status: "confirmed",
  },
]

const mockNetworkStats: NetworkStats = {
  blockHeight: 1000847,
  hashRate: "245.7 TH/s",
  difficulty: "2.5T",
  avgBlockTime: 15.2,
  pendingTransactions: 1247,
  networkNodes: 8934,
  totalSupply: "21,000,000 IST",
}

export function BlockchainLedger() {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks)
  const [networkStats, setNetworkStats] = useState<NetworkStats>(mockNetworkStats)
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time block generation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newBlock: Block = {
        number: blocks[0].number + 1,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        parentHash: blocks[0].hash,
        timestamp: new Date().toISOString(),
        transactions: Math.floor(Math.random() * 300) + 50,
        gasUsed: Math.floor(Math.random() * 10000000) + 5000000,
        gasLimit: 15000000,
        miner: `0x${Math.random().toString(16).substr(2, 40)}`,
        difficulty: "2.5T",
        size: Math.floor(Math.random() * 50000) + 30000,
        status: "confirmed",
      }

      setBlocks((prev) => [newBlock, ...prev.slice(0, 9)]) // Keep last 10 blocks

      setNetworkStats((prev) => ({
        ...prev,
        blockHeight: newBlock.number,
        pendingTransactions: Math.floor(Math.random() * 2000) + 500,
        avgBlockTime: Math.round((Math.random() * 5 + 12) * 10) / 10,
      }))
    }, 8000) // New block every 8 seconds

    return () => clearInterval(interval)
  }, [isLive, blocks])

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const blockTime = new Date(timestamp)
    const diffSeconds = Math.floor((now.getTime() - blockTime.getTime()) / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Network className="h-5 w-5 mr-2 text-blue-400" />
            Invisible Shield Blockchain Network
          </CardTitle>
          <CardDescription className="text-slate-400">
            Real-time blockchain network statistics and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Blocks className="h-4 w-4 text-purple-400" />
                <span className="text-slate-300 text-sm">Block Height</span>
              </div>
              <p className="text-2xl font-bold text-white">{networkStats.blockHeight.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">Hash Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{networkStats.hashRate}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-slate-300 text-sm">Avg Block Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{networkStats.avgBlockTime}s</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Pending Txns</span>
              </div>
              <p className="text-2xl font-bold text-white">{networkStats.pendingTransactions.toLocaleString()}</p>
            </div>
          </div>

          <Separator className="my-6 bg-slate-700" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-slate-400"}`} />
                <span className="text-slate-300">{isLive ? "Live Network" : "Paused"}</span>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {networkStats.networkNodes.toLocaleString()} Nodes
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Difficulty: {networkStats.difficulty}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              {isLive ? "Pause" : "Resume"} Live Feed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blocks */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-400" />
            Recent Blocks
          </CardTitle>
          <CardDescription className="text-slate-400">
            Latest blocks mined on the Invisible Shield blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.hash} className="border border-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Blocks className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Block #{block.number.toLocaleString()}</h4>
                    <p className="text-slate-400 text-sm">{formatTime(block.timestamp)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {index === 0 && isLive && <Badge className="bg-green-600 animate-pulse">Latest</Badge>}
                  <Badge className="bg-blue-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmed
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">Block Hash:</span>
                  </div>
                  <code className="text-xs text-green-400 font-mono">{formatHash(block.hash)}</code>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">Parent Hash:</span>
                  </div>
                  <code className="text-xs text-slate-400 font-mono">{formatHash(block.parentHash)}</code>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Transactions:</span>
                  <p className="text-white font-medium">{block.transactions}</p>
                </div>
                <div>
                  <span className="text-slate-400">Gas Used:</span>
                  <p className="text-white font-medium">{(block.gasUsed / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <span className="text-slate-400">Size:</span>
                  <p className="text-white font-medium">{(block.size / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <span className="text-slate-400">Miner:</span>
                  <code className="text-blue-400 font-mono text-xs">{formatHash(block.miner)}</code>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Gas Utilization</span>
                  <span className="text-slate-300">{Math.round((block.gasUsed / block.gasLimit) * 100)}%</span>
                </div>
                <Progress value={(block.gasUsed / block.gasLimit) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Network Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              Network Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Network Uptime</span>
                <span className="text-green-400 font-medium">99.98%</span>
              </div>
              <Progress value={99.98} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Node Synchronization</span>
                <span className="text-blue-400 font-medium">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Transaction Throughput</span>
                <span className="text-purple-400 font-medium">847 TPS</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Trust Score Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">2,847</p>
                <p className="text-sm text-slate-400">Trust Updates Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">78.5</p>
                <p className="text-sm text-slate-400">Avg Trust Score</p>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Platinum Tier</span>
                <span className="text-purple-400">12.3%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Gold Tier</span>
                <span className="text-yellow-400">28.7%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Silver Tier</span>
                <span className="text-slate-400">41.2%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Bronze Tier</span>
                <span className="text-orange-400">17.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
