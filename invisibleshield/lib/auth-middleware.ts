"use client"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "invisible-shield-secret-key-2024"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "analyst"
  permissions: string[]
  lastLogin?: string
  createdAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
}

export interface Permission {
  resource: string
  action: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  role: "admin" | "analyst" | "viewer"
  permissions: string[]
}

export interface AuthResult {
  valid: boolean
  user?: AuthUser
  error?: string
}

class AuthMiddleware {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  }

  private listeners: ((state: AuthState) => void)[] = []

  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (typeof window === "undefined") return

    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.state = {
          isAuthenticated: true,
          user,
          token,
          loading: false,
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        this.clearAuth()
      }
    } else {
      this.state.loading = false
    }

    this.notifyListeners()
  }

  public subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state))
  }

  public getState(): AuthState {
    return { ...this.state }
  }

  public async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.loading = true
    this.notifyListeners()

    try {
      // Mock authentication for development
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (password === "password") {
          const mockUser: User = {
            id: "user_" + Date.now(),
            email,
            name: email.split("@")[0],
            role: email.includes("admin") ? "admin" : "user",
            permissions: this.getPermissionsForRole(email.includes("admin") ? "admin" : "user"),
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }

          const token = generateToken({
            id: mockUser.id,
            username: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            permissions: mockUser.permissions,
          })

          this.state = {
            isAuthenticated: true,
            user: mockUser,
            token,
            loading: false,
          }

          // Store in localStorage
          localStorage.setItem("auth_token", token)
          localStorage.setItem("user_data", JSON.stringify(mockUser))

          this.notifyListeners()
          return { success: true }
        } else {
          this.state.loading = false
          this.notifyListeners()
          return { success: false, error: "Invalid credentials" }
        }
      }

      // In production, make actual API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const token = generateToken({
          id: data.user.id,
          username: data.user.name,
          email: data.user.email,
          role: data.user.role,
          permissions: data.user.permissions,
        })

        this.state = {
          isAuthenticated: true,
          user: data.user,
          token,
          loading: false,
        }

        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", JSON.stringify(data.user))

        this.notifyListeners()
        return { success: true }
      } else {
        this.state.loading = false
        this.notifyListeners()
        return { success: false, error: data.message || "Login failed" }
      }
    } catch (error) {
      this.state.loading = false
      this.notifyListeners()
      return { success: false, error: "Network error" }
    }
  }

  public logout() {
    this.clearAuth()
    this.notifyListeners()
  }

  private clearAuth() {
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    }
  }

  public hasPermission(resource: string, action: string): boolean {
    if (!this.state.user) return false

    const permission = `${resource}:${action}`
    return this.state.user.permissions.includes(permission) || this.state.user.permissions.includes("*:*")
  }

  public hasRole(role: string): boolean {
    return this.state.user?.role === role
  }

  public isAdmin(): boolean {
    return this.hasRole("admin")
  }

  private getPermissionsForRole(role: string): string[] {
    const permissions = {
      admin: [
        "*:*", // All permissions
      ],
      analyst: [
        "threats:read",
        "threats:analyze",
        "transactions:read",
        "reports:read",
        "reports:create",
        "dashboard:read",
      ],
      user: ["dashboard:read", "transactions:read", "reports:read"],
    }

    return permissions[role as keyof typeof permissions] || []
  }

  public async verifyToken(): Promise<boolean> {
    if (!this.state.token) return false

    try {
      // Mock verification for development
      if (process.env.NODE_ENV === "development" && this.state.token.startsWith("mock_")) {
        return true
      }

      const decoded = jwt.verify(this.state.token, JWT_SECRET) as any

      return true
    } catch (error) {
      console.error("Token verification failed:", error)
      this.clearAuth()
      this.notifyListeners()
      return false
    }
  }

  public async refreshToken(): Promise<boolean> {
    if (!this.state.token) return false

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        this.state.token = data.token
        localStorage.setItem("auth_token", data.token)
        this.notifyListeners()
        return true
      } else {
        this.clearAuth()
        this.notifyListeners()
        return false
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      return false
    }
  }

  public requireAuth(): boolean {
    return this.state.isAuthenticated
  }

  public requirePermission(resource: string, action: string): boolean {
    return this.requireAuth() && this.hasPermission(resource, action)
  }

  public requireRole(role: string): boolean {
    return this.requireAuth() && this.hasRole(role)
  }

  public getAuthHeaders(): Record<string, string> {
    if (!this.state.token) return {}

    return {
      Authorization: `Bearer ${this.state.token}`,
    }
  }
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware()

// Export types and classes
export { AuthMiddleware }
export type { User, AuthState, Permission, AuthUser, AuthResult }

function generateToken(user: Partial<AuthUser>): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}
