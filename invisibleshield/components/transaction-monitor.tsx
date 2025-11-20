"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"
import { TransactionDetailModal } from "@/components/modals/transaction-detail-modal"

interface Transaction {
  id: string
  customer: string
  amount: number
  type: string
  riskScore: number
  status: "approved" | "flagged" | "blocked"
  timestamp: string
  location: string
}

export function TransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN-001",
      customer: "John Smith",
      amount: 1250.0,
      type: "Purchase",
      riskScore: 85,
      status: "flagged",
      timestamp: "2024-01-15 14:32:15",
      location: "New York, NY",
    },
    {
      id: "TXN-002",
      customer: "Sarah Johnson",
      amount: 45.99,
      type: "Return",
      riskScore: 15,
      status: "approved",
      timestamp: "2024-01-15 14:28:42",
      location: "Los Angeles, CA",
    },
    {
      id: "TXN-003",
      customer: "Mike Wilson",
      amount: 2500.0,
      type: "Purchase",
      riskScore: 95,
      status: "blocked",
      timestamp: "2024-01-15 14:25:18",
      location: "Chicago, IL",
    },
    {
      id: "TXN-004",
      customer: "Emily Davis",
      amount: 89.5,
      type: "Loyalty Redemption",
      riskScore: 25,
      status: "approved",
      timestamp: "2024-01-15 14:22:33",
      location: "Houston, TX",
    },
    {
      id: "TXN-005",
      customer: "Robert Brown",
      amount: 350.0,
      type: "Return",
      riskScore: 75,
      status: "flagged",
      timestamp: "2024-01-15 14:18:07",
      location: "Phoenix, AZ",
    },
  ])

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">High Priority</Badge>
    if (score >= 50)
      return (
        <Badge variant="secondary" className="bg-yellow-600">
          Medium Priority
        </Badge>
      )
    return (
      <Badge variant="secondary" className="bg-green-600">
        Low Priority
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  // Simulate new transactions
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: `TXN-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        customer: ["Alex Turner", "Lisa Chen", "David Miller", "Anna Garcia"][Math.floor(Math.random() * 4)],
        amount: Math.floor(Math.random() * 2000) + 50,
        type: ["Purchase", "Return", "Loyalty Redemption"][Math.floor(Math.random() * 3)],
        riskScore: Math.floor(Math.random() * 100),
        status: Math.random() > 0.7 ? "flagged" : Math.random() > 0.9 ? "blocked" : "approved",
        timestamp: new Date().toLocaleString(),
        location: ["Miami, FL", "Seattle, WA", "Denver, CO", "Atlanta, GA"][Math.floor(Math.random() * 4)],
      }

      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction Volume</CardTitle>
            <CardDescription className="text-slate-400">Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Processed</span>
                <span className="text-white">15,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Reviewed</span>
                <span className="text-yellow-400">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Flagged</span>
                <span className="text-red-400">67</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Security Monitoring</CardTitle>
            <CardDescription className="text-slate-400">System protection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Active</div>
            <p className="text-sm text-slate-400 mt-1">All security systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Transaction Monitor</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time transaction analysis and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Transaction ID</TableHead>
                <TableHead className="text-slate-300">Customer</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Priority Score</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Location</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-slate-700">
                  <TableCell className="text-slate-300 font-mono">{transaction.id}</TableCell>
                  <TableCell className="text-white">{transaction.customer}</TableCell>
                  <TableCell className="text-white">${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-slate-300">{transaction.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{transaction.riskScore}</span>
                      {getRiskBadge(transaction.riskScore)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className="text-white capitalize">{transaction.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{transaction.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 bg-transparent"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  )
}
