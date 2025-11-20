"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { threatEngine, type ThreatData } from "@/lib/threat-intelligence"
import { Globe, MapPin, Shield, AlertTriangle } from "lucide-react"

export function ThreatMap() {
  const [threats, setThreats] = useState<ThreatData[]>([])
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null)

  useEffect(() => {
    const handleThreat = (threat: ThreatData) => {
      setThreats((prev) => [threat, ...prev.slice(0, 49)]) // Keep last 50 threats
    }

    threatEngine.onThreatDetected(handleThreat)

    // Load initial threats
    setThreats(threatEngine.getAllThreats().slice(0, 50))
  }, [])

  const threatsByCountry = threats.reduce(
    (acc, threat) => {
      const country = threat.geolocation.country
      if (!acc[country]) {
        acc[country] = []
      }
      acc[country].push(threat)
      return acc
    },
    {} as Record<string, ThreatData[]>,
  )

  const topThreatCountries = Object.entries(threatsByCountry)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 10)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Threat Map Visualization */}
      <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Global Threat Map
          </CardTitle>
          <CardDescription className="text-slate-400">
            Real-time visualization of security threats worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Simplified world map representation */}
          <div className="relative bg-slate-900/50 rounded-lg p-6 h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

            {/* Threat indicators */}
            {threats.slice(0, 20).map((threat, index) => (
              <div
                key={threat.id}
                className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 ${
                  threat.severity === "critical"
                    ? "bg-red-500 animate-pulse"
                    : threat.severity === "high"
                      ? "bg-orange-500"
                      : threat.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                }`}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 70 + 15}%`,
                }}
                onClick={() => setSelectedThreat(threat)}
                title={`${threat.type} from ${threat.geolocation.country}`}
              />
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-slate-300">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-xs text-slate-300">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-xs text-slate-300">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs text-slate-300">Low</span>
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute top-4 right-4 bg-slate-800/80 rounded-lg p-3">
              <div className="text-white font-semibold">{threats.length}</div>
              <div className="text-xs text-slate-400">Active Threats</div>
            </div>
          </div>

          {/* Selected threat details */}
          {selectedThreat && (
            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">Threat Details</h4>
                <Badge
                  className={
                    selectedThreat.severity === "critical"
                      ? "bg-red-600"
                      : selectedThreat.severity === "high"
                        ? "bg-orange-600"
                        : selectedThreat.severity === "medium"
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                  }
                >
                  {selectedThreat.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Type:</span>
                  <span className="text-white ml-2">{selectedThreat.type}</span>
                </div>
                <div>
                  <span className="text-slate-400">Source:</span>
                  <span className="text-white ml-2">{selectedThreat.source}</span>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white ml-2">
                    {selectedThreat.geolocation.city}, {selectedThreat.geolocation.country}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <span className={`ml-2 ${selectedThreat.blocked ? "text-green-400" : "text-red-400"}`}>
                    {selectedThreat.blocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-slate-400">Indicators:</span>
                <div className="text-white text-sm mt-1">{selectedThreat.indicators.join(", ")}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-400" />
            Threat Origins
          </CardTitle>
          <CardDescription className="text-slate-400">Top countries by threat volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topThreatCountries.map(([country, countryThreats]) => (
              <div key={country} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-white">{country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">{countryThreats.length}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((countryThreats.length / threats.length) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-white font-semibold mb-3">Threat Types</h4>
            <div className="space-y-2">
              {Object.entries(
                threats.reduce(
                  (acc, threat) => {
                    acc[threat.type] = (acc[threat.type] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>,
                ),
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-slate-300 capitalize">{type}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Mitigation Rate</span>
              <span className="text-green-400 font-semibold">
                {Math.round((threats.filter((t) => t.blocked).length / threats.length) * 100)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">
                {threats.filter((t) => t.blocked).length} of {threats.length} threats blocked
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
