import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock customer trust scores database
const customerTrustScores: Record<
  string,
  {
    customerId: string
    trustScore: number
    tier: "Bronze" | "Silver" | "Gold" | "Platinum"
    factors: {
      transactionHistory: number
      paymentBehavior: number
      accountAge: number
      verificationLevel: number
      returnBehavior: number
    }
    history: Array<{
      score: number
      timestamp: string
      reason: string
      changedBy?: string
    }>
    lastUpdated: string
  }
> = {}

// Initialize some sample data
function initializeSampleData() {
  const sampleCustomers = [
    "CUST-001",
    "CUST-002",
    "CUST-003",
    "CUST-004",
    "CUST-005",
    "CUST-006",
    "CUST-007",
    "CUST-008",
    "CUST-009",
    "CUST-010",
  ]

  sampleCustomers.forEach((customerId) => {
    const score = Math.floor(Math.random() * 100)
    const tier = score >= 90 ? "Platinum" : score >= 75 ? "Gold" : score >= 50 ? "Silver" : ("Bronze" as const)

    customerTrustScores[customerId] = {
      customerId,
      trustScore: score,
      tier,
      factors: {
        transactionHistory: Math.floor(Math.random() * 100),
        paymentBehavior: Math.floor(Math.random() * 100),
        accountAge: Math.floor(Math.random() * 100),
        verificationLevel: Math.floor(Math.random() * 100),
        returnBehavior: Math.floor(Math.random() * 100),
      },
      history: [
        {
          score,
          timestamp: new Date().toISOString(),
          reason: "Initial calculation",
        },
      ],
      lastUpdated: new Date().toISOString(),
    }
  })
}

// Initialize sample data if empty
if (Object.keys(customerTrustScores).length === 0) {
  initializeSampleData()
}

function calculateTrustTier(score: number): "Bronze" | "Silver" | "Gold" | "Platinum" {
  if (score >= 90) return "Platinum"
  if (score >= 75) return "Gold"
  if (score >= 50) return "Silver"
  return "Bronze"
}

export async function GET(request: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customerId } = params

    // Get or create customer trust score
    let customerData = customerTrustScores[customerId]
    if (!customerData) {
      // Create new customer with default score
      const initialScore = 50 // Default neutral score
      customerData = {
        customerId,
        trustScore: initialScore,
        tier: calculateTrustTier(initialScore),
        factors: {
          transactionHistory: 50,
          paymentBehavior: 50,
          accountAge: 50,
          verificationLevel: 50,
          returnBehavior: 50,
        },
        history: [
          {
            score: initialScore,
            timestamp: new Date().toISOString(),
            reason: "New customer - default score",
          },
        ],
        lastUpdated: new Date().toISOString(),
      }
      customerTrustScores[customerId] = customerData
    }

    return NextResponse.json(customerData)
  } catch (error) {
    console.error("Get trust score error:", error)
    return NextResponse.json({ error: "Failed to fetch trust score" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customerId } = params
    const { score, reason, factors } = await request.json()

    if (score !== undefined && (score < 0 || score > 100)) {
      return NextResponse.json({ error: "Score must be between 0 and 100" }, { status: 400 })
    }

    // Get existing customer data or create new
    let customerData = customerTrustScores[customerId]
    if (!customerData) {
      customerData = {
        customerId,
        trustScore: 50,
        tier: "Silver",
        factors: {
          transactionHistory: 50,
          paymentBehavior: 50,
          accountAge: 50,
          verificationLevel: 50,
          returnBehavior: 50,
        },
        history: [],
        lastUpdated: new Date().toISOString(),
      }
    }

    // Update score if provided
    if (score !== undefined) {
      customerData.trustScore = score
      customerData.tier = calculateTrustTier(score)

      // Add to history
      customerData.history.push({
        score,
        timestamp: new Date().toISOString(),
        reason: reason || "Manual update",
        changedBy: authResult.user?.username,
      })

      // Keep only last 50 history entries
      if (customerData.history.length > 50) {
        customerData.history = customerData.history.slice(-50)
      }
    }

    // Update factors if provided
    if (factors) {
      customerData.factors = { ...customerData.factors, ...factors }

      // Recalculate score based on factors
      const factorValues = Object.values(customerData.factors)
      const avgScore = factorValues.reduce((sum, val) => sum + val, 0) / factorValues.length
      customerData.trustScore = Math.round(avgScore)
      customerData.tier = calculateTrustTier(customerData.trustScore)

      customerData.history.push({
        score: customerData.trustScore,
        timestamp: new Date().toISOString(),
        reason: "Recalculated from factors",
        changedBy: authResult.user?.username,
      })
    }

    customerData.lastUpdated = new Date().toISOString()
    customerTrustScores[customerId] = customerData

    return NextResponse.json(customerData)
  } catch (error) {
    console.error("Update trust score error:", error)
    return NextResponse.json({ error: "Failed to update trust score" }, { status: 500 })
  }
}
