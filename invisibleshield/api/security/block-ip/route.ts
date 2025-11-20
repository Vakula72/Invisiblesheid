import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock blocked IPs database
let blockedIPs: Array<{
  ip: string
  reason: string
  blockedAt: string
  blockedBy: string
  expiresAt?: string
  active: boolean
}> = []

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ip, reason, duration } = await request.json()

    if (!ip || !reason) {
      return NextResponse.json({ error: "IP address and reason required" }, { status: 400 })
    }

    // Check if IP is already blocked
    const existingBlock = blockedIPs.find((blocked) => blocked.ip === ip && blocked.active)
    if (existingBlock) {
      return NextResponse.json({ error: "IP already blocked", blockedIP: existingBlock }, { status: 409 })
    }

    // Calculate expiration time if duration is provided (in hours)
    const expiresAt = duration ? new Date(Date.now() + duration * 60 * 60 * 1000).toISOString() : undefined

    const blockedIP = {
      ip,
      reason,
      blockedAt: new Date().toISOString(),
      blockedBy: authResult.user?.username || "system",
      expiresAt,
      active: true,
    }

    blockedIPs.push(blockedIP)

    // In production, this would update firewall rules, WAF, etc.
    console.log(`IP ${ip} blocked by ${authResult.user?.username}: ${reason}`)

    return NextResponse.json({
      message: "IP blocked successfully",
      blockedIP,
      totalBlocked: blockedIPs.filter((b) => b.active).length,
    })
  } catch (error) {
    console.error("Block IP error:", error)
    return NextResponse.json({ error: "Failed to block IP" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Clean up expired blocks
    const now = new Date()
    blockedIPs = blockedIPs.map((blocked) => {
      if (blocked.expiresAt && new Date(blocked.expiresAt) < now) {
        return { ...blocked, active: false }
      }
      return blocked
    })

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    let filteredIPs = blockedIPs
    if (activeOnly) {
      filteredIPs = blockedIPs.filter((b) => b.active)
    }

    return NextResponse.json({
      blockedIPs: filteredIPs.sort((a, b) => new Date(b.blockedAt).getTime() - new Date(a.blockedAt).getTime()),
      stats: {
        total: blockedIPs.length,
        active: blockedIPs.filter((b) => b.active).length,
        expired: blockedIPs.filter((b) => !b.active).length,
      },
    })
  } catch (error) {
    console.error("Get blocked IPs error:", error)
    return NextResponse.json({ error: "Failed to fetch blocked IPs" }, { status: 500 })
  }
}
