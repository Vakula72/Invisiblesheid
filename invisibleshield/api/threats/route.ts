import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

interface ThreatData {
  id: string
  type: "malware" | "phishing" | "ddos" | "injection" | "bruteforce" | "insider"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  timestamp: string
  blocked: boolean
  confidence: number
  indicators: string[]
  geolocation: {
    country: string
    city: string
    lat: number
    lng: number
  }
  description: string
  mitigation: string[]
}

// Mock threat database - in production, use a real database
let threats: ThreatData[] = []

// Generate initial threat data
function generateInitialThreats() {
  const threatTypes: ThreatData["type"][] = ["malware", "phishing", "ddos", "injection", "bruteforce", "insider"]
  const severities: ThreatData["severity"][] = ["low", "medium", "high", "critical"]
  const countries = [
    { name: "Russia", city: "Moscow", lat: 55.7558, lng: 37.6176 },
    { name: "China", city: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "North Korea", city: "Pyongyang", lat: 39.0392, lng: 125.7625 },
    { name: "Iran", city: "Tehran", lat: 35.6892, lng: 51.389 },
    { name: "Unknown", city: "Unknown", lat: 0, lng: 0 },
  ]

  for (let i = 0; i < 50; i++) {
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const location = countries[Math.floor(Math.random() * countries.length)]

    threats.push({
      id: `THREAT-${Date.now()}-${i}`,
      type,
      severity,
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      target: "api.invisibleshield.com",
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      blocked: Math.random() > 0.2,
      confidence: Math.floor(Math.random() * 40) + 60,
      indicators: generateIndicators(type),
      geolocation: {
        country: location.name,
        city: location.city,
        lat: location.lat + (Math.random() - 0.5) * 10,
        lng: location.lng + (Math.random() - 0.5) * 10,
      },
      description: generateThreatDescription(type, severity),
      mitigation: generateMitigation(type),
    })
  }
}

function generateIndicators(type: ThreatData["type"]): string[] {
  const indicators = {
    malware: ["Suspicious file hash", "Known malware signature", "Unusual network traffic", "Registry modifications"],
    phishing: ["Suspicious domain", "Fake SSL certificate", "Social engineering attempt", "Credential harvesting"],
    ddos: ["High request volume", "Distributed sources", "Resource exhaustion", "Amplification attack"],
    injection: ["SQL injection pattern", "XSS attempt", "Command injection", "LDAP injection"],
    bruteforce: ["Multiple failed logins", "Dictionary attack", "Credential stuffing", "Password spraying"],
    insider: ["Unusual access pattern", "Data exfiltration", "Privilege escalation", "After-hours activity"],
  }

  const typeIndicators = indicators[type] || []
  const count = Math.floor(Math.random() * 3) + 1
  return typeIndicators.slice(0, count)
}

function generateThreatDescription(type: ThreatData["type"], severity: ThreatData["severity"]): string {
  const descriptions = {
    malware: `${severity.charAt(0).toUpperCase() + severity.slice(1)} severity malware detected attempting to compromise system integrity`,
    phishing: `${severity.charAt(0).toUpperCase() + severity.slice(1)} phishing campaign targeting user credentials and sensitive information`,
    ddos: `${severity.charAt(0).toUpperCase() + severity.slice(1)} DDoS attack attempting to overwhelm system resources`,
    injection: `${severity.charAt(0).toUpperCase() + severity.slice(1)} code injection attack targeting application vulnerabilities`,
    bruteforce: `${severity.charAt(0).toUpperCase() + severity.slice(1)} brute force attack attempting unauthorized access`,
    insider: `${severity.charAt(0).toUpperCase() + severity.slice(1)} insider threat detected with suspicious access patterns`,
  }

  return descriptions[type] || "Unknown threat detected"
}

function generateMitigation(type: ThreatData["type"]): string[] {
  const mitigations = {
    malware: [
      "Quarantine infected files",
      "Update antivirus signatures",
      "Scan all systems",
      "Block malicious domains",
    ],
    phishing: ["Block suspicious domains", "Update email filters", "User awareness training", "Report to authorities"],
    ddos: ["Rate limiting", "Traffic filtering", "CDN protection", "Upstream filtering"],
    injection: ["Input validation", "Parameterized queries", "WAF rules", "Code review"],
    bruteforce: ["Account lockout", "IP blocking", "MFA enforcement", "Password policy"],
    insider: ["Access review", "Behavioral monitoring", "Privilege restriction", "Investigation"],
  }

  return mitigations[type] || ["Monitor closely", "Investigate further"]
}

// Initialize threats if empty
if (threats.length === 0) {
  generateInitialThreats()
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")
    const blocked = searchParams.get("blocked")

    let filteredThreats = [...threats]

    // Apply filters
    if (severity) {
      filteredThreats = filteredThreats.filter((t) => t.severity === severity)
    }
    if (type) {
      filteredThreats = filteredThreats.filter((t) => t.type === type)
    }
    if (blocked !== null) {
      filteredThreats = filteredThreats.filter((t) => t.blocked === (blocked === "true"))
    }

    // Sort by timestamp (newest first)
    filteredThreats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    const paginatedThreats = filteredThreats.slice(0, limit)

    // Calculate statistics
    const stats = {
      total: threats.length,
      filtered: filteredThreats.length,
      blocked: threats.filter((t) => t.blocked).length,
      active: threats.filter((t) => !t.blocked).length,
      bySeverity: {
        critical: threats.filter((t) => t.severity === "critical").length,
        high: threats.filter((t) => t.severity === "high").length,
        medium: threats.filter((t) => t.severity === "medium").length,
        low: threats.filter((t) => t.severity === "low").length,
      },
      byType: threats.reduce(
        (acc, threat) => {
          acc[threat.type] = (acc[threat.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return NextResponse.json({
      threats: paginatedThreats,
      stats,
      pagination: {
        limit,
        total: filteredThreats.length,
        hasMore: filteredThreats.length > limit,
      },
    })
  } catch (error) {
    console.error("Get threats error:", error)
    return NextResponse.json({ error: "Failed to fetch threats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.valid || !authResult.user?.permissions.includes("write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const threatData = await request.json()
    const newThreat: ThreatData = {
      id: `THREAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      blocked: false,
      confidence: 100, // Manual entry has high confidence
      ...threatData,
    }

    threats.unshift(newThreat) // Add to beginning

    // Keep only last 1000 threats in memory
    if (threats.length > 1000) {
      threats = threats.slice(0, 1000)
    }

    return NextResponse.json(newThreat, { status: 201 })
  } catch (error) {
    console.error("Create threat error:", error)
    return NextResponse.json({ error: "Failed to create threat" }, { status: 500 })
  }
}
