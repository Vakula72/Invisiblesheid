"use client"

import { useState, useEffect, useRef } from "react"

export interface WebSocketMessage {
  id: string
  type: "system" | "security_event" | "transaction" | "threat"
  timestamp: string
  data: any
}

export interface WebSocketConfig {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(config: WebSocketConfig = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const {
    url = "wss://echo.websocket.org", // Fallback WebSocket for demo
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = config

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus("connecting")

    try {
      // For demo purposes, simulate WebSocket connection
      // In production, this would connect to your actual WebSocket server
      const simulateConnection = () => {
        setIsConnected(true)
        setConnectionStatus("connected")
        reconnectAttemptsRef.current = 0

        // Start generating real-time data
        startDataGeneration()
      }

      setTimeout(simulateConnection, 1000)
    } catch (error) {
      console.error("WebSocket connection error:", error)
      setConnectionStatus("error")
      handleReconnect()
    }
  }

  const startDataGeneration = () => {
    // Generate system metrics every 5 seconds
    const systemInterval = setInterval(() => {
      if (!isConnected) return

      const systemMessage: WebSocketMessage = {
        id: `sys_${Date.now()}`,
        type: "system",
        timestamp: new Date().toISOString(),
        data: {
          cpu: Math.round((Math.random() * 40 + 30) * 10) / 10,
          memory: Math.round((Math.random() * 30 + 50) * 10) / 10,
          network: Math.round((Math.random() * 50 + 40) * 10) / 10,
          activeConnections: Math.floor(Math.random() * 1000) + 500,
          throughput: Math.floor(Math.random() * 5000) + 2000,
        },
      }

      setMessages((prev) => [systemMessage, ...prev.slice(0, 49)]) // Keep last 50 messages
    }, 5000)

    // Generate security events every 8-15 seconds
    const securityInterval = setInterval(
      () => {
        if (!isConnected) return

        const events = [
          "Trust Score Updated",
          "Blockchain Transaction Verified",
          "Customer Verification Complete",
          "Fraud Pattern Detected",
          "Security Scan Complete",
        ]

        const securityMessage: WebSocketMessage = {
          id: `sec_${Date.now()}`,
          type: "security_event",
          timestamp: new Date().toISOString(),
          data: {
            event: events[Math.floor(Math.random() * events.length)],
            source: `192.168.1.${Math.floor(Math.random() * 255)}`,
            action: "PROCESSED",
            details: "Event processed successfully by security engine",
          },
        }

        setMessages((prev) => [securityMessage, ...prev.slice(0, 49)])
      },
      Math.random() * 7000 + 8000,
    )

    // Store intervals for cleanup
    return () => {
      clearInterval(systemInterval)
      clearInterval(securityInterval)
    }
  }

  const handleReconnect = () => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log("Max reconnection attempts reached")
      setConnectionStatus("error")
      return
    }

    reconnectAttemptsRef.current++
    console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)

    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, reconnectInterval)
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    setIsConnected(false)
    setConnectionStatus("disconnected")
  }

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket is not connected")
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    connectionStatus,
    messages,
    sendMessage,
    disconnect,
    reconnect: connect,
    clearMessages,
  }
}

export type { WebSocketMessage, WebSocketConfig }
