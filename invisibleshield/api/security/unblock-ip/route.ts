import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Mock blocked IPs database (shared with block-ip route)
const blockedIPs: Array<{
  ip: string
  reason: string
  blockedAt: string
  blockedBy: string
  expiresAt?: string
  active: boolean
  unblockedAt?: string
  unblockedBy?: string
  unblockReason?: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ip, reason } = await request.json()

    if (!ip) {
      return NextResponse.json({ error: "IP address required" }, { status: 400 })
    }

    // Find the blocked IP
    const blockedIPIndex = blockedIPs.findIndex((blocked) => blocked.ip === ip && blocked.active)
    if (blockedIPIndex === -1) {
      return NextResponse.json({ error: "IP not found in blocked list" }, { status: 404 })
    }

    // Unblock the IP
    blockedIPs[blockedIPIndex] = {
      ...blockedIPs[blockedIPIndex],
      active: false,
      unblockedAt: new Date().toISOString(),
      unblockedBy: authResult.user?.username || "system",
      unblockReason: reason || "Manual unblock",
    }

    console.log(`IP ${ip} unblocked by ${authResult.user?.username}: ${reason || "Manual unblock"}`)

    return NextResponse.json({
      message: "IP unblocked successfully",
      unblockedIP: blockedIPs[blockedIPIndex],
      totalBlocked: blockedIPs.filter((b) => b.active).length,
    })
  } catch (error) {
    console.error("Unblock IP error:", error)
    return NextResponse.json({ error: "Failed to unblock IP" }, { status: 500 })
  }
}
