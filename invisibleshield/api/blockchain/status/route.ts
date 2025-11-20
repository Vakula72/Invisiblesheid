import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock blockchain network status
function generateBlockchainStatus() {
  const now = Date.now()
  const blockTime = 12000 // 12 seconds average block time

  return {
    network: {
      name: "Invisible Shield Network",
      chainId: "0x1337",
      consensus: "Proof of Trust",
      status: "operational",
      uptime: 99.97,
    },
    blocks: {
      latest: Math.floor(now / blockTime) + 1000000,
      avgBlockTime: 12.3 + (Math.random() - 0.5) * 2,
      totalTransactions: Math.floor(Math.random() * 1000000) + 5000000,
      pendingTransactions: Math.floor(Math.random() * 100) + 10,
    },
    nodes: {
      total: 247 + Math.floor(Math.random() * 20),
      active: 245 + Math.floor(Math.random() * 5),
      validators: 21,
      syncStatus: "synced",
    },
    security: {
      hashRate: `${(245.7 + (Math.random() - 0.5) * 50).toFixed(1)} TH/s`,
      difficulty: "24.5T",
      networkSecurity: "high",
      lastSecurityAudit: "2024-01-01T00:00:00Z",
    },
    performance: {
      tps: Math.floor(Math.random() * 1000) + 2000, // Transactions per second
      gasPrice: `${(20 + Math.random() * 10).toFixed(2)} gwei`,
      avgConfirmationTime: `${(45 + Math.random() * 30).toFixed(1)}s`,
    },
    trust: {
      totalTrustScore: Math.floor(Math.random() * 20) + 85,
      verifiedTransactions: Math.floor(Math.random() * 100000) + 500000,
      trustNodes: 156 + Math.floor(Math.random() * 10),
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = generateBlockchainStatus()

    return NextResponse.json({
      ...status,
      timestamp: new Date().toISOString(),
      requestedBy: authResult.user?.username,
    })
  } catch (error) {
    console.error("Get blockchain status error:", error)
    return NextResponse.json({ error: "Failed to fetch blockchain status" }, { status: 500 })
  }
}
