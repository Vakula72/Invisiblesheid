import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"
import crypto from "crypto"

// Mock blockchain transaction records
let blockchainRecords: Array<{
  id: string
  transactionHash: string
  blockHash: string
  blockNumber: number
  timestamp: string
  data: any
  gasUsed: number
  confirmations: number
  status: "pending" | "confirmed" | "failed"
}> = []

function generateTransactionHash(): string {
  return "0x" + crypto.randomBytes(32).toString("hex")
}

function generateBlockHash(): string {
  return "0x" + crypto.randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactionData = await request.json()

    // Create blockchain record
    const record = {
      id: `BLK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionHash: generateTransactionHash(),
      blockHash: generateBlockHash(),
      blockNumber: Math.floor(Date.now() / 12000) + 1000000, // Simulate block number
      timestamp: new Date().toISOString(),
      data: {
        ...transactionData,
        recordedBy: authResult.user?.username,
        integrity: crypto.createHash("sha256").update(JSON.stringify(transactionData)).digest("hex"),
      },
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      confirmations: 0,
      status: "pending" as const,
    }

    blockchainRecords.unshift(record)

    // Simulate confirmation process
    setTimeout(
      () => {
        const recordIndex = blockchainRecords.findIndex((r) => r.id === record.id)
        if (recordIndex !== -1) {
          blockchainRecords[recordIndex].status = "confirmed"
          blockchainRecords[recordIndex].confirmations = Math.floor(Math.random() * 12) + 1
        }
      },
      2000 + Math.random() * 8000,
    ) // 2-10 seconds

    // Keep only last 1000 records
    if (blockchainRecords.length > 1000) {
      blockchainRecords = blockchainRecords.slice(0, 1000)
    }

    return NextResponse.json({
      message: "Transaction recorded on blockchain",
      record: {
        id: record.id,
        transactionHash: record.transactionHash,
        blockHash: record.blockHash,
        blockNumber: record.blockNumber,
        timestamp: record.timestamp,
        status: record.status,
        gasUsed: record.gasUsed,
      },
    })
  } catch (error) {
    console.error("Record blockchain transaction error:", error)
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const status = searchParams.get("status")

    let filteredRecords = [...blockchainRecords]

    if (status) {
      filteredRecords = filteredRecords.filter((r) => r.status === status)
    }

    const paginatedRecords = filteredRecords.slice(0, limit)

    return NextResponse.json({
      records: paginatedRecords.map((record) => ({
        id: record.id,
        transactionHash: record.transactionHash,
        blockHash: record.blockHash,
        blockNumber: record.blockNumber,
        timestamp: record.timestamp,
        gasUsed: record.gasUsed,
        confirmations: record.confirmations,
        status: record.status,
      })),
      stats: {
        total: blockchainRecords.length,
        pending: blockchainRecords.filter((r) => r.status === "pending").length,
        confirmed: blockchainRecords.filter((r) => r.status === "confirmed").length,
        failed: blockchainRecords.filter((r) => r.status === "failed").length,
      },
    })
  } catch (error) {
    console.error("Get blockchain records error:", error)
    return NextResponse.json({ error: "Failed to fetch blockchain records" }, { status: 500 })
  }
}
