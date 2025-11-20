"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SecurityTrendData {
  time: string
  threats: number
  blocked: number
  transactions: number
  riskScore: number
}

export function SecurityTrendChart() {
  const [data, setData] = useState<SecurityTrendData[]>([])

  // Initialize with sample data
  useEffect(() => {
    const now = new Date()
    const initialData: SecurityTrendData[] = []

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      initialData.push({
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        threats: Math.floor(Math.random() * 50) + 10,
        blocked: Math.floor(Math.random() * 30) + 5,
        transactions: Math.floor(Math.random() * 200) + 100,
        riskScore: Math.floor(Math.random() * 40) + 20,
      })
    }

    setData(initialData)
  }, [])

  // Update data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)] // Remove first item
        const now = new Date()

        newData.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          threats: Math.floor(Math.random() * 50) + 10,
          blocked: Math.floor(Math.random() * 30) + 5,
          transactions: Math.floor(Math.random() * 200) + 100,
          riskScore: Math.floor(Math.random() * 40) + 20,
        })

        return newData
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Security Trends (24h)</CardTitle>
        <CardDescription className="text-slate-400">Real-time security metrics and threat patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRiskScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#e5e7eb" }} />
              <Area
                type="monotone"
                dataKey="threats"
                stackId="1"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorThreats)"
                name="Threats Detected"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stackId="2"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorBlocked)"
                name="Threats Blocked"
              />
              <Area
                type="monotone"
                dataKey="riskScore"
                stackId="3"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorRiskScore)"
                name="Average Risk Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {data.length > 0 ? data[data.length - 1]?.threats : 0}
            </div>
            <div className="text-xs text-slate-400">Current Threats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.length > 0 ? data[data.length - 1]?.blocked : 0}
            </div>
            <div className="text-xs text-slate-400">Blocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {data.length > 0 ? data[data.length - 1]?.transactions : 0}
            </div>
            <div className="text-xs text-slate-400">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {data.length > 0 ? data[data.length - 1]?.riskScore : 0}
            </div>
            <div className="text-xs text-slate-400">Risk Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
