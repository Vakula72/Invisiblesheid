import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"
import crypto from "crypto"

interface TrustTransaction {
  id: string
  customerId: string
  transactionType: "PURCHASE" | "RETURN" | "LOYALTY" | "VERIFICATION" | "FRAUD_REPORT"
  amount?: number
  trustScoreBefore: number
  trustScoreAfter: number
  timestamp: string
  location: string
  deviceFingerprint: string
  fraudIndicators: string[]
  verificationMethod: string
  blockHash?: string
  confirmed: boolean
}

interface CustomerTrustProfile {
  customerId: string
  currentTrustScore: number
  trustTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
  accountAge: number
  totalTransactions: number
  successfulTransactions: number
  fraudIncidents: number
  lastActivity: string
  verificationLevel: "BASIC" | "ENHANCED" | "PREMIUM"
  riskFactors: string[]
  trustHistory: TrustTransaction[]
  blockchainHash: string
}

// In-memory storage for demo (in production, use proper database)
const trustProfiles: Map<string, CustomerTrustProfile> = new Map()
const trustTransactions: TrustTransaction[] = []

// Initialize sample data
function initializeSampleData() {
  const sampleProfiles: CustomerTrustProfile[] = [
    {
      customerId: "CUST-001",
      currentTrustScore: 87,
      trustTier: "GOLD",
      accountAge: 24,
      totalTransactions: 156,
      successfulTransactions: 154,
      fraudIncidents: 0,
      lastActivity: new Date().toISOString(),
      verificationLevel: "ENHANCED",
      riskFactors: [],
      trustHistory: [],
      blockchainHash: generateBlockchainHash("CUST-001", 87),
    },
    {
      customerId: "CUST-002",
      currentTrustScore: 34,
      trustTier: "BRONZE",
      accountAge: 2,
      totalTransactions: 23,
      successfulTransactions: 18,
      fraudIncidents: 3,
      lastActivity: new Date().toISOString(),
      verificationLevel: "BASIC",
      riskFactors: ["HIGH_VALUE_TRANSACTIONS", "NEW_ACCOUNT", "MULTIPLE_DEVICES"],
      trustHistory: [],
      blockchainHash: generateBlockchainHash("CUST-002", 34),
    },
    {
      customerId: "CUST-003",
      currentTrustScore: 92,
      trustTier: "PLATINUM",
      accountAge: 36,
      totalTransactions: 342,
      successfulTransactions: 340,
      fraudIncidents: 0,
      lastActivity: new Date().toISOString(),
      verificationLevel: "PREMIUM",
      riskFactors: [],
      trustHistory: [],
      blockchainHash: generateBlockchainHash("CUST-003", 92),
    },
  ]

  sampleProfiles.forEach((profile) => {
    trustProfiles.set(profile.customerId, profile)
  })
}

function generateBlockchainHash(customerId: string, trustScore: number): string {
  const data = `${customerId}:${trustScore}:${Date.now()}`
  return crypto.createHash("sha256").update(data).digest("hex")
}

function calculateTrustTier(score: number): "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" {
  if (score >= 90) return "PLATINUM"
  if (score >= 75) return "GOLD"
  if (score >= 50) return "SILVER"
  return "BRONZE"
}

function calculateNewTrustScore(
  currentScore: number,
  transactionType: string,
  amount = 0,
  fraudIndicators: string[] = [],
): number {
  let scoreChange = 0

  // Base score changes by transaction type
  switch (transactionType) {
    case "PURCHASE":
      scoreChange = amount > 1000 ? -1 : 1
      break
    case "RETURN":
      scoreChange = -1
      break
    case "LOYALTY":
      scoreChange = 2
      break
    case "VERIFICATION":
      scoreChange = 5
      break
    case "FRAUD_REPORT":
      scoreChange = -10
      break
  }

  // Penalize for fraud indicators
  scoreChange -= fraudIndicators.length * 3

  // Apply diminishing returns for high scores
  if (currentScore > 80) {
    scoreChange = Math.floor(scoreChange * 0.5)
  }

  return Math.max(0, Math.min(100, currentScore + scoreChange))
}

// Initialize sample data
initializeSampleData()

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (customerId) {
      // Get specific customer trust profile
      const profile = trustProfiles.get(customerId)
      if (!profile) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        profile,
        blockchainVerified: true,
        lastVerification: new Date().toISOString(),
      })
    } else {
      // Get all trust profiles summary
      const profiles = Array.from(trustProfiles.values()).map((profile) => ({
        customerId: profile.customerId,
        trustScore: profile.currentTrustScore,
        trustTier: profile.trustTier,
        riskLevel: profile.fraudIncidents > 2 ? "HIGH" : profile.fraudIncidents > 0 ? "MEDIUM" : "LOW",
        lastActivity: profile.lastActivity,
      }))

      return NextResponse.json({
        success: true,
        profiles,
        totalCustomers: profiles.length,
        averageTrustScore: profiles.reduce((sum, p) => sum + p.trustScore, 0) / profiles.length,
      })
    }
  } catch (error) {
    console.error("Get trust passport error:", error)
    return NextResponse.json({ error: "Failed to retrieve trust data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactionData = await request.json()
    const { customerId, transactionType, amount, location, deviceFingerprint, fraudIndicators, verificationMethod } =
      transactionData

    // Get or create customer profile
    let profile = trustProfiles.get(customerId)
    if (!profile) {
      profile = {
        customerId,
        currentTrustScore: 50, // Default starting score
        trustTier: "SILVER",
        accountAge: 0,
        totalTransactions: 0,
        successfulTransactions: 0,
        fraudIncidents: 0,
        lastActivity: new Date().toISOString(),
        verificationLevel: "BASIC",
        riskFactors: [],
        trustHistory: [],
        blockchainHash: generateBlockchainHash(customerId, 50),
      }
    }

    // Calculate new trust score
    const oldScore = profile.currentTrustScore
    const newScore = calculateNewTrustScore(oldScore, transactionType, amount, fraudIndicators)

    // Create trust transaction record
    const trustTransaction: TrustTransaction = {
      id: crypto.randomUUID(),
      customerId,
      transactionType: transactionType as any,
      amount,
      trustScoreBefore: oldScore,
      trustScoreAfter: newScore,
      timestamp: new Date().toISOString(),
      location: location || "Unknown",
      deviceFingerprint: deviceFingerprint || "Unknown",
      fraudIndicators: fraudIndicators || [],
      verificationMethod: verificationMethod || "STANDARD",
      blockHash: generateBlockchainHash(customerId, newScore),
      confirmed: true,
    }

    // Update profile
    profile.currentTrustScore = newScore
    profile.trustTier = calculateTrustTier(newScore)
    profile.totalTransactions += 1
    profile.lastActivity = new Date().toISOString()
    profile.blockchainHash = trustTransaction.blockHash!

    if (transactionType !== "FRAUD_REPORT") {
      profile.successfulTransactions += 1
    } else {
      profile.fraudIncidents += 1
    }

    // Update risk factors
    profile.riskFactors = []
    if (profile.fraudIncidents > 2) profile.riskFactors.push("MULTIPLE_FRAUD_INCIDENTS")
    if (profile.accountAge < 3) profile.riskFactors.push("NEW_ACCOUNT")
    if (newScore < 40) profile.riskFactors.push("LOW_TRUST_SCORE")

    // Add to trust history
    profile.trustHistory.unshift(trustTransaction)
    if (profile.trustHistory.length > 50) {
      profile.trustHistory = profile.trustHistory.slice(0, 50)
    }

    // Save updates
    trustProfiles.set(customerId, profile)
    trustTransactions.unshift(trustTransaction)

    // Keep only last 1000 transactions
    if (trustTransactions.length > 1000) {
      trustTransactions.splice(1000)
    }

    return NextResponse.json({
      success: true,
      transaction: trustTransaction,
      updatedProfile: {
        customerId: profile.customerId,
        oldTrustScore: oldScore,
        newTrustScore: newScore,
        trustTier: profile.trustTier,
        blockchainHash: profile.blockchainHash,
      },
      blockchainConfirmation: {
        blockHash: trustTransaction.blockHash,
        timestamp: trustTransaction.timestamp,
        confirmed: true,
      },
    })
  } catch (error) {
    console.error("Create trust transaction error:", error)
    return NextResponse.json({ error: "Failed to process trust transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("admin")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { customerId, newTrustScore, reason } = await request.json()

    if (!customerId || newTrustScore === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (newTrustScore < 0 || newTrustScore > 100) {
      return NextResponse.json({ error: "Trust score must be between 0 and 100" }, { status: 400 })
    }

    const profile = trustProfiles.get(customerId)
    if (!profile) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const oldScore = profile.currentTrustScore

    // Create manual adjustment transaction
    const adjustmentTransaction: TrustTransaction = {
      id: crypto.randomUUID(),
      customerId,
      transactionType: "VERIFICATION",
      trustScoreBefore: oldScore,
      trustScoreAfter: newTrustScore,
      timestamp: new Date().toISOString(),
      location: "ADMIN_PANEL",
      deviceFingerprint: "ADMIN",
      fraudIndicators: [],
      verificationMethod: "MANUAL_ADJUSTMENT",
      blockHash: generateBlockchainHash(customerId, newTrustScore),
      confirmed: true,
    }

    // Update profile
    profile.currentTrustScore = newTrustScore
    profile.trustTier = calculateTrustTier(newTrustScore)
    profile.lastActivity = new Date().toISOString()
    profile.blockchainHash = adjustmentTransaction.blockHash!
    profile.trustHistory.unshift(adjustmentTransaction)

    trustProfiles.set(customerId, profile)
    trustTransactions.unshift(adjustmentTransaction)

    return NextResponse.json({
      success: true,
      message: "Trust score updated successfully",
      adjustment: {
        customerId,
        oldScore,
        newScore: newTrustScore,
        reason: reason || "Manual adjustment",
        adjustedBy: authResult.user?.username,
        timestamp: adjustmentTransaction.timestamp,
        blockchainHash: adjustmentTransaction.blockHash,
      },
    })
  } catch (error) {
    console.error("Update trust score error:", error)
    return NextResponse.json({ error: "Failed to update trust score" }, { status: 500 })
  }
}
