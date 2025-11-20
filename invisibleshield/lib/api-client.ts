"use client"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export interface ThreatAnalysisRequest {
  ip: string
  userAgent?: string
  location?: string
  timestamp?: string
}

export interface ThreatAnalysisResponse {
  riskScore: number
  threats: string[]
  blocked: boolean
  confidence: number
}

export interface TransactionRequest {
  amount: number
  currency: string
  customerId: string
  merchantId: string
  paymentMethod: string
}

export interface TransactionResponse {
  id: string
  status: "approved" | "declined" | "pending" | "flagged"
  riskScore: number
  processingTime: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.invisibleshield.com"

    // Try to get token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (credentials.password === "password") {
        const mockResponse: LoginResponse = {
          token: "mock_jwt_token_" + Date.now(),
          user: {
            id: "user_123",
            email: credentials.email,
            name: credentials.email.split("@")[0],
            role: credentials.email.includes("admin") ? "admin" : "user",
          },
        }

        this.token = mockResponse.token
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", this.token)
        }

        return { success: true, data: mockResponse }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    }

    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<void> {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    if (!this.token) {
      return { success: false, error: "No token available" }
    }

    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      return { success: true, data: { valid: true } }
    }

    return this.request<{ valid: boolean }>("/auth/verify")
  }

  // Threat Intelligence
  async analyzeThreat(request: ThreatAnalysisRequest): Promise<ApiResponse<ThreatAnalysisResponse>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockResponse: ThreatAnalysisResponse = {
        riskScore: Math.floor(Math.random() * 100),
        threats: ["suspicious_ip", "high_frequency_requests"],
        blocked: Math.random() > 0.7,
        confidence: Math.floor(Math.random() * 40) + 60,
      }

      return { success: true, data: mockResponse }
    }

    return this.request<ThreatAnalysisResponse>("/threats/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getThreats(): Promise<ApiResponse<any[]>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      const mockThreats = Array.from({ length: 10 }, (_, i) => ({
        id: `threat_${i}`,
        type: ["malware", "phishing", "ddos"][Math.floor(Math.random() * 3)],
        severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
        source: `192.168.1.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        blocked: Math.random() > 0.5,
      }))

      return { success: true, data: mockThreats }
    }

    return this.request<any[]>("/threats")
  }

  async blockIP(ip: string): Promise<ApiResponse<{ blocked: boolean }>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true, data: { blocked: true } }
    }

    return this.request<{ blocked: boolean }>("/security/block-ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    })
  }

  async unblockIP(ip: string): Promise<ApiResponse<{ unblocked: boolean }>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true, data: { unblocked: true } }
    }

    return this.request<{ unblocked: boolean }>("/security/unblock-ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    })
  }

  // Transaction Processing
  async processTransaction(request: TransactionRequest): Promise<ApiResponse<TransactionResponse>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockResponse: TransactionResponse = {
        id: `txn_${Date.now()}`,
        status: Math.random() > 0.1 ? "approved" : "flagged",
        riskScore: Math.floor(Math.random() * 100),
        processingTime: Math.floor(Math.random() * 500) + 100,
      }

      return { success: true, data: mockResponse }
    }

    return this.request<TransactionResponse>("/transactions/process", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getTransactions(): Promise<ApiResponse<any[]>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
        id: `txn_${i}`,
        amount: Math.floor(Math.random() * 10000) + 100,
        currency: "USD",
        status: ["approved", "declined", "pending", "flagged"][Math.floor(Math.random() * 4)],
        customerId: `customer_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        riskScore: Math.floor(Math.random() * 100),
      }))

      return { success: true, data: mockTransactions }
    }

    return this.request<any[]>("/transactions")
  }

  // System Metrics
  async getSystemMetrics(): Promise<ApiResponse<any>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      const mockMetrics = {
        cpu: Math.floor(Math.random() * 50) + 20,
        memory: Math.floor(Math.random() * 60) + 30,
        network: Math.floor(Math.random() * 100),
        threats: Math.floor(Math.random() * 10),
        blocked: Math.floor(Math.random() * 50),
        uptime: Math.floor(Math.random() * 86400),
      }

      return { success: true, data: mockMetrics }
    }

    return this.request<any>("/system/metrics")
  }

  // Trust Score
  async getTrustScore(customerId: string): Promise<ApiResponse<{ score: number; factors: any[] }>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      const mockScore = {
        score: Math.floor(Math.random() * 100),
        factors: [
          { name: "Transaction History", weight: 0.3, score: Math.floor(Math.random() * 100) },
          { name: "Identity Verification", weight: 0.25, score: Math.floor(Math.random() * 100) },
          { name: "Device Trust", weight: 0.2, score: Math.floor(Math.random() * 100) },
          { name: "Behavioral Analysis", weight: 0.15, score: Math.floor(Math.random() * 100) },
          { name: "Network Reputation", weight: 0.1, score: Math.floor(Math.random() * 100) },
        ],
      }

      return { success: true, data: mockScore }
    }

    return this.request<{ score: number; factors: any[] }>(`/trust/score/${customerId}`)
  }

  // Blockchain
  async recordToBlockchain(data: any): Promise<ApiResponse<{ hash: string; blockNumber: number }>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse = {
        hash: "0x" + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      }

      return { success: true, data: mockResponse }
    }

    return this.request<{ hash: string; blockNumber: number }>("/blockchain/record", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBlockchainStatus(): Promise<ApiResponse<{ connected: boolean; latestBlock: number }>> {
    // Mock implementation for development
    if (process.env.NODE_ENV === "development") {
      const mockStatus = {
        connected: Math.random() > 0.1,
        latestBlock: Math.floor(Math.random() * 1000000) + 1000000,
      }

      return { success: true, data: mockStatus }
    }

    return this.request<{ connected: boolean; latestBlock: number }>("/blockchain/status")
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types and classes
export { ApiClient }
