import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

interface TransactionData {
  id: string
  customerId: string
  amount: number
  currency: string
  paymentMethod: string
  merchantCategory: string
  location: {
    country: string
    city: string
    ip: string
  }
  deviceFingerprint: string
  timestamp: string
  customerHistory: {
    totalTransactions: number
    avgAmount: number
    lastTransactionDate: string
    trustScore: number
  }
}

interface FraudRule {
  id: string
  name: string
  enabled: boolean
  severity: "low" | "medium" | "high" | "critical"
  conditions: Array<{
    field: string
    operator: string
    value: any
  }>
  weight: number
}

// Mock fraud rules database
const fraudRules: FraudRule[] = [
  {
    id: "high-amount",
    name: "High Amount Transaction",
    enabled: true,
    severity: "high",
    conditions: [{ field: "amount", operator: "greater_than", value: 5000 }],
    weight: 40,
  },
  {
    id: "velocity-check",
    name: "Transaction Velocity",
    enabled: true,
    severity: "critical",
    conditions: [{ field: "velocity", operator: "greater_than", value: 5 }],
    weight: 60,
  },
  {
    id: "geo-anomaly",
    name: "Geographic Anomaly",
    enabled: true,
    severity: "medium",
    conditions: [{ field: "location_risk", operator: "greater_than", value: 70 }],
    weight: 25,
  },
  {
    id: "low-trust-score",
    name: "Low Trust Score",
    enabled: true,
    severity: "high",
    conditions: [{ field: "trustScore", operator: "less_than", value: 30 }],
    weight: 35,
  },
  {
    id: "suspicious-device",
    name: "Suspicious Device",
    enabled: true,
    severity: "medium",
    conditions: [{ field: "device_known", operator: "equals", value: false }],
    weight: 20,
  },
]

// Advanced ML-based fraud detection simulation
function mlFraudDetection(transaction: TransactionData): { score: number; confidence: number; features: any } {
  const features = {
    amount_zscore:
      (transaction.amount - transaction.customerHistory.avgAmount) /
      Math.max(transaction.customerHistory.avgAmount * 0.5, 100),
    hour_of_day: new Date(transaction.timestamp).getHours(),
    day_of_week: new Date(transaction.timestamp).getDay(),
    transaction_frequency: transaction.customerHistory.totalTransactions / 365,
    trust_score: transaction.customerHistory.trustScore,
    amount_ratio: transaction.amount / Math.max(transaction.customerHistory.avgAmount, 1),
    time_since_last: Math.min(
      (Date.now() - new Date(transaction.customerHistory.lastTransactionDate).getTime()) / (1000 * 60 * 60),
      168,
    ), // hours, capped at 1 week
  }

  // Simulate neural network prediction
  let mlScore = 0
  mlScore += Math.max(0, features.amount_zscore * 15) // Unusual amount
  mlScore += features.hour_of_day < 6 || features.hour_of_day > 22 ? 20 : 0 // Unusual hours
  mlScore += features.day_of_week === 0 || features.day_of_week === 6 ? 10 : 0 // Weekend
  mlScore += Math.max(0, (100 - features.trust_score) * 0.3) // Low trust
  mlScore += Math.max(0, Math.log(features.amount_ratio) * 10) // Amount ratio
  mlScore += features.time_since_last < 1 ? 25 : 0 // Very recent transaction

  // Add some randomness to simulate model uncertainty
  mlScore += (Math.random() - 0.5) * 10

  const confidence = Math.max(0.6, Math.min(0.95, 0.8 + (Math.random() - 0.5) * 0.3))

  return {
    score: Math.max(0, Math.min(100, mlScore)),
    confidence,
    features,
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transaction: TransactionData = await request.json()
    const startTime = Date.now()

    // Rule-based analysis
    const triggeredRules: string[] = []
    const riskFactors: Array<{ factor: string; weight: number; value: any }> = []
    let ruleBasedScore = 0

    for (const rule of fraudRules.filter((r) => r.enabled)) {
      if (evaluateRule(rule, transaction)) {
        triggeredRules.push(rule.id)
        ruleBasedScore += rule.weight
        riskFactors.push({
          factor: rule.name,
          weight: rule.weight,
          value: getFieldValue(transaction, rule.conditions[0].field),
        })
      }
    }

    // ML-based analysis
    const mlResult = mlFraudDetection(transaction)

    // Combine scores (60% ML, 40% rules)
    const combinedScore = Math.min(100, ruleBasedScore * 0.4 + mlResult.score * 0.6)

    // Determine decision
    let decision: "approve" | "flag" | "block" = "approve"
    if (combinedScore >= 80) decision = "block"
    else if (combinedScore >= 50) decision = "flag"

    const processingTime = Date.now() - startTime

    // Log the analysis for audit trail
    const analysisResult = {
      transactionId: transaction.id,
      riskScore: Math.round(combinedScore),
      decision,
      triggeredRules,
      riskFactors,
      confidence: mlResult.confidence,
      processingTime,
      mlFeatures: mlResult.features,
      timestamp: new Date().toISOString(),
      analyzedBy: authResult.user?.username,
    }

    // In production, save to database
    console.log("Fraud Analysis:", analysisResult)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Fraud analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

function evaluateRule(rule: FraudRule, transaction: TransactionData): boolean {
  return rule.conditions.every((condition) => {
    const value = getFieldValue(transaction, condition.field)

    switch (condition.operator) {
      case "equals":
        return value === condition.value
      case "not_equals":
        return value !== condition.value
      case "greater_than":
        return Number(value) > Number(condition.value)
      case "less_than":
        return Number(value) < Number(condition.value)
      case "contains":
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase())
      default:
        return false
    }
  })
}

function getFieldValue(transaction: TransactionData, field: string): any {
  switch (field) {
    case "amount":
      return transaction.amount
    case "trustScore":
      return transaction.customerHistory.trustScore
    case "velocity":
      // Simulate velocity calculation based on recent transactions
      return Math.floor(Math.random() * 10)
    case "location_risk":
      // Simulate location risk score based on IP geolocation
      const riskCountries = ["CN", "RU", "KP", "IR"]
      const isHighRisk = riskCountries.includes(transaction.location.country)
      return isHighRisk ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50)
    case "device_known":
      // Simulate device fingerprint recognition
      return Math.random() > 0.3
    default:
      return null
  }
}
