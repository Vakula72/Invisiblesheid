import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock fraud rules database (shared with parent route)
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rule = fraudRules.find((r) => r.id === params.id)
    if (!rule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 })
    }

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Get fraud rule error:", error)
    return NextResponse.json({ error: "Failed to fetch rule" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ruleIndex = fraudRules.findIndex((r) => r.id === params.id)
    if (ruleIndex === -1) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 })
    }

    const updates = await request.json()
    fraudRules[ruleIndex] = {
      ...fraudRules[ruleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(fraudRules[ruleIndex])
  } catch (error) {
    console.error("Update fraud rule error:", error)
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ruleIndex = fraudRules.findIndex((r) => r.id === params.id)
    if (ruleIndex === -1) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 })
    }

    const deletedRule = fraudRules.splice(ruleIndex, 1)[0]
    return NextResponse.json({ message: "Rule deleted", rule: deletedRule })
  } catch (error) {
    console.error("Delete fraud rule error:", error)
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 })
  }
}
