import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock fraud rules database
const fraudRules = [
  {
    id: "high-amount",
    name: "High Amount Transaction",
    description: "Flag transactions above $5000",
    enabled: true,
    severity: "high" as const,
    conditions: [{ field: "amount", operator: "greater_than", value: 5000 }],
    actions: ["flag", "review"],
    weight: 40,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "velocity-check",
    name: "Transaction Velocity",
    description: "Block rapid successive transactions",
    enabled: true,
    severity: "critical" as const,
    conditions: [{ field: "velocity", operator: "greater_than", value: 5 }],
    actions: ["block", "notify"],
    weight: 60,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "geo-anomaly",
    name: "Geographic Anomaly",
    description: "Flag transactions from unusual locations",
    enabled: true,
    severity: "medium" as const,
    conditions: [{ field: "location_risk", operator: "greater_than", value: 70 }],
    actions: ["flag", "review"],
    weight: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      rules: fraudRules,
      total: fraudRules.length,
      enabled: fraudRules.filter((r) => r.enabled).length,
    })
  } catch (error) {
    console.error("Get fraud rules error:", error)
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ruleData = await request.json()
    const newRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    fraudRules.push(newRule)

    return NextResponse.json(newRule, { status: 201 })
  } catch (error) {
    console.error("Create fraud rule error:", error)
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 })
  }
}
