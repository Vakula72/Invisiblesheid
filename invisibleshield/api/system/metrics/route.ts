import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// System metrics simulation
function generateSystemMetrics() {
  const baseTime = Date.now()
  const metrics = []

  // Generate last 24 hours of metrics (every 5 minutes)
  for (let i = 0; i < 288; i++) {
    const timestamp = new Date(baseTime - i * 5 * 60 * 1000).toISOString()

    // Simulate realistic system metrics with some patterns
    const hourOfDay = new Date(timestamp).getHours()
    const isBusinessHours = hourOfDay >= 8 && hourOfDay <= 18

    // Higher load during business hours
    const baseLoad = isBusinessHours ? 40 : 20
    const cpuUsage = Math.max(0, Math.min(100, baseLoad + (Math.random() - 0.5) * 30))
    const memoryUsage = Math.max(0, Math.min(100, baseLoad + 20 + (Math.random() - 0.5) * 25))
    const networkUsage = Math.max(0, Math.min(100, Math.random() * 80))

    // Threat metrics
    const threatsDetected = Math.floor(Math.random() * 10) + (isBusinessHours ? 5 : 2)
    const threatsBlocked = Math.floor(threatsDetected * (0.8 + Math.random() * 0.2))

    // Transaction metrics
    const transactionsProcessed = Math.floor(Math.random() * 1000) + (isBusinessHours ? 2000 : 500)
    const fraudDetected = Math.floor(transactionsProcessed * (0.02 + Math.random() * 0.03))

    metrics.push({
      timestamp,
      system: {
        cpu: Math.round(cpuUsage * 10) / 10,
        memory: Math.round(memoryUsage * 10) / 10,
        network: Math.round(networkUsage * 10) / 10,
        disk: Math.round((30 + Math.random() * 20) * 10) / 10,
        uptime: 99.9 + Math.random() * 0.1,
      },
      security: {
        threatsDetected,
        threatsBlocked,
        activeThreatSources: Math.floor(Math.random() * 50) + 10,
        blockedIPs: Math.floor(Math.random() * 100) + 200,
      },
      fraud: {
        transactionsProcessed,
        fraudDetected,
        fraudBlocked: Math.floor(fraudDetected * 0.9),
        riskScore: Math.round((20 + Math.random() * 60) * 10) / 10,
      },
      performance: {
        responseTime: Math.round((30 + Math.random() * 50) * 10) / 10,
        throughput: Math.floor(Math.random() * 5000) + 1000,
        errorRate: Math.round(Math.random() * 2 * 100) / 100,
      },
    })
  }

  return metrics.reverse() // Oldest first
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("range") || "24h" // 1h, 6h, 24h, 7d, 30d
    const metric = searchParams.get("metric") // system, security, fraud, performance

    // Generate metrics based on time range
    let metrics = generateSystemMetrics()

    // Filter by time range
    const now = Date.now()
    const timeRanges = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }

    const rangeMs = timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"]
    const cutoffTime = now - rangeMs

    metrics = metrics.filter((m) => new Date(m.timestamp).getTime() >= cutoffTime)

    // Calculate current values (latest metric)
    const latest = metrics[metrics.length - 1]
    const current = latest
      ? {
          system: latest.system,
          security: latest.security,
          fraud: latest.fraud,
          performance: latest.performance,
        }
      : null

    // Calculate aggregated statistics
    const stats = {
      system: {
        avgCPU: Math.round((metrics.reduce((sum, m) => sum + m.system.cpu, 0) / metrics.length) * 10) / 10,
        avgMemory: Math.round((metrics.reduce((sum, m) => sum + m.system.memory, 0) / metrics.length) * 10) / 10,
        avgNetwork: Math.round((metrics.reduce((sum, m) => sum + m.system.network, 0) / metrics.length) * 10) / 10,
        minUptime: Math.min(...metrics.map((m) => m.system.uptime)),
      },
      security: {
        totalThreats: metrics.reduce((sum, m) => sum + m.security.threatsDetected, 0),
        totalBlocked: metrics.reduce((sum, m) => sum + m.security.threatsBlocked, 0),
        blockRate:
          Math.round(
            (metrics.reduce((sum, m) => sum + m.security.threatsBlocked, 0) /
              Math.max(
                1,
                metrics.reduce((sum, m) => sum + m.security.threatsDetected, 0),
              )) *
              100 *
              10,
          ) / 10,
      },
      fraud: {
        totalTransactions: metrics.reduce((sum, m) => sum + m.fraud.transactionsProcessed, 0),
        totalFraud: metrics.reduce((sum, m) => sum + m.fraud.fraudDetected, 0),
        fraudRate:
          Math.round(
            (metrics.reduce((sum, m) => sum + m.fraud.fraudDetected, 0) /
              Math.max(
                1,
                metrics.reduce((sum, m) => sum + m.fraud.transactionsProcessed, 0),
              )) *
              100 *
              100,
          ) / 100,
      },
      performance: {
        avgResponseTime:
          Math.round((metrics.reduce((sum, m) => sum + m.performance.responseTime, 0) / metrics.length) * 10) / 10,
        avgThroughput: Math.round(metrics.reduce((sum, m) => sum + m.performance.throughput, 0) / metrics.length),
        avgErrorRate:
          Math.round((metrics.reduce((sum, m) => sum + m.performance.errorRate, 0) / metrics.length) * 100) / 100,
      },
    }

    // Filter by specific metric if requested
    let responseData: any = {
      current,
      stats,
      metrics,
      timeRange,
      dataPoints: metrics.length,
    }

    if (metric && current && (current as any)[metric]) {
      responseData = {
        current: (current as any)[metric],
        stats: (stats as any)[metric],
        metrics: metrics.map((m) => ({
          timestamp: m.timestamp,
          ...(m as any)[metric],
        })),
        timeRange,
        dataPoints: metrics.length,
      }
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Get system metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch system metrics" }, { status: 500 })
  }
}
