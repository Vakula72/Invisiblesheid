"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface TrustDistributionData {
  name: string
  value: number
  color: string
  description: string
}

export function TrustDistributionChart() {
  const [data, setData] = useState<TrustDistributionData[]>([
    { name: "Platinum (90-100)", value: 15, color: "#8b5cf6", description: "Highest trust customers" },
    { name: "Gold (75-89)", value: 28, color: "#f59e0b", description: "High trust customers" },
    { name: "Silver (50-74)", value: 35, color: "#6b7280", description: "Medium trust customers" },
    { name: "Bronze (0-49)", value: 22, color: "#cd7f32", description: "Low trust customers" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.max(5, Math.min(50, item.value + (Math.random() - 0.5) * 4)),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-slate-300">{data.description}</p>
          <p className="text-blue-400 font-bold">{data.value}% of customers</p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300 text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Trust Score Distribution</CardTitle>
        <CardDescription className="text-slate-400">Customer trust levels across different tiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
              <div className="text-2xl font-bold text-white">{item.value}%</div>
              <div className="text-xs text-slate-400">{item.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
