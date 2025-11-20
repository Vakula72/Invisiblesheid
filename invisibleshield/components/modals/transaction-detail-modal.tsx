"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, XCircle, MapPin, CreditCard, User, Clock } from "lucide-react"

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

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "blocked":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>
      case "flagged":
        return <Badge className="bg-yellow-600">Flagged</Badge>
      case "blocked":
        return <Badge className="bg-red-600">Blocked</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "text-red-400" }
    if (score >= 50) return { level: "Medium", color: "text-yellow-400" }
    return { level: "Low", color: "text-green-400" }
  }

  const riskLevel = getRiskLevel(transaction.riskScore)

  // Mock additional transaction details
  const transactionDetails = {
    paymentMethod: "Credit Card ****1234",
    deviceInfo: "Chrome 120.0 on Windows 10",
    ipAddress: "192.168.1.100",
    merchantCategory: "Electronics",
    authCode: "AUTH123456",
    processingTime: "47ms",
    securityChecks: [
      { name: "Identity Verification", status: "passed", icon: <CheckCircle className="h-4 w-4 text-green-400" /> },
      { name: "Device Recognition", status: "passed", icon: <CheckCircle className="h-4 w-4 text-green-400" /> },
      {
        name: "Behavioral Analysis",
        status: transaction.status === "blocked" ? "failed" : "passed",
        icon:
          transaction.status === "blocked" ? (
            <XCircle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ),
      },
      { name: "Geolocation Check", status: "passed", icon: <CheckCircle className="h-4 w-4 text-green-400" /> },
    ],
    riskFactors:
      transaction.riskScore > 70
        ? ["High transaction amount", "New payment method", "Unusual time of day"]
        : transaction.riskScore > 40
          ? ["Moderate transaction amount"]
          : [],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStatusIcon(transaction.status)}
            <span>Transaction Details - {transaction.id}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Comprehensive analysis and security assessment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Transaction Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-slate-400">Customer</div>
                    <div className="text-white">{transaction.customer}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm text-slate-400">Amount</div>
                    <div className="text-white text-xl font-bold">${transaction.amount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-yellow-400" />
                  <div>
                    <div className="text-sm text-slate-400">Location</div>
                    <div className="text-white">{transaction.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-sm text-slate-400">Timestamp</div>
                    <div className="text-white">{transaction.timestamp}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Security Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  {getStatusBadge(transaction.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Risk Score</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${riskLevel.color}`}>{transaction.riskScore}</span>
                    <Badge variant="outline" className={riskLevel.color}>
                      {riskLevel.level} Risk
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Processing Time</span>
                  <span className="text-white">{transactionDetails.processingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Auth Code</span>
                  <span className="text-white font-mono">{transactionDetails.authCode}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Security Checks */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Security Checks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transactionDetails.securityChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {check.icon}
                    <span className="text-slate-300">{check.name}</span>
                  </div>
                  <Badge variant={check.status === "passed" ? "default" : "destructive"}>
                    {check.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          {transactionDetails.riskFactors.length > 0 && (
            <>
              <Separator className="bg-slate-700" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Risk Factors</h3>
                <div className="space-y-2">
                  {transactionDetails.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-slate-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Technical Details */}
          <Separator className="bg-slate-700" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="text-white">{transactionDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device Info:</span>
                  <span className="text-white">{transactionDetails.deviceInfo}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Address:</span>
                  <span className="text-white font-mono">{transactionDetails.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant Category:</span>
                  <span className="text-white">{transactionDetails.merchantCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {transaction.status === "flagged" && (
              <>
                <Button variant="destructive">Block Transaction</Button>
                <Button className="bg-green-600 hover:bg-green-700">Approve Transaction</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
