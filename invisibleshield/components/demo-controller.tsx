"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Play,
  Pause,
  Square,
  FastForward,
  Rewind,
  Zap,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  Blocks,
} from "lucide-react"

interface DemoStep {
  id: string
  title: string
  description: string
  duration: number
  icon: React.ComponentType<any>
  action: () => void
}

interface DemoControllerProps {
  isOpen: boolean
  onClose: () => void
  onStepChange?: (step: DemoStep) => void
}

export function DemoController({ isOpen, onClose, onStepChange }: DemoControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)

  const demoSteps: DemoStep[] = [
    {
      id: "intro",
      title: "Welcome to Invisible Shield",
      description: "AI-powered fraud prevention system for retail environments",
      duration: 3000,
      icon: Shield,
      action: () => console.log("Intro step"),
    },
    {
      id: "fraud-detection",
      title: "AI Fraud Detection",
      description: "Demonstrating real-time fraud pattern recognition",
      duration: 5000,
      icon: Zap,
      action: () => {
        // Simulate fraud detection
        console.log("Simulating fraud detection...")
      },
    },
    {
      id: "trust-passport",
      title: "Trust Passport System",
      description: "Blockchain-based customer trust scoring",
      duration: 4000,
      icon: Users,
      action: () => {
        // Navigate to trust passport
        window.location.href = "/trust"
      },
    },
    {
      id: "threat-monitoring",
      title: "Threat Monitoring",
      description: "Live security threat detection and response",
      duration: 4000,
      icon: AlertTriangle,
      action: () => {
        // Navigate to monitor
        window.location.href = "/monitor"
      },
    },
    {
      id: "blockchain-ledger",
      title: "Blockchain Ledger",
      description: "Immutable transaction recording system",
      duration: 4000,
      icon: Blocks,
      action: () => {
        // Navigate to blockchain
        window.location.href = "/blockchain"
      },
    },
    {
      id: "analytics",
      title: "Security Analytics",
      description: "Comprehensive fraud prevention insights",
      duration: 4000,
      icon: Activity,
      action: () => {
        // Navigate to insights
        window.location.href = "/insights"
      },
    },
    {
      id: "complete",
      title: "Demo Complete",
      description: "Invisible Shield: Your complete fraud prevention solution",
      duration: 3000,
      icon: CheckCircle,
      action: () => {
        console.log("Demo completed")
      },
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    let stepInterval: NodeJS.Timeout

    if (isPlaying && currentStep < demoSteps.length) {
      const currentDemoStep = demoSteps[currentStep]

      // Execute step action
      currentDemoStep.action()
      onStepChange?.(currentDemoStep)

      // Update step progress
      stepInterval = setInterval(() => {
        setStepProgress((prev) => {
          const newProgress = prev + 100 / (currentDemoStep.duration / 100)
          if (newProgress >= 100) {
            return 100
          }
          return newProgress
        })
      }, 100)

      // Move to next step after duration
      interval = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        setStepProgress(0)
        setProgress((prev) => prev + 100 / demoSteps.length)
      }, currentDemoStep.duration)
    }

    return () => {
      if (interval) clearTimeout(interval)
      if (stepInterval) clearInterval(stepInterval)
    }
  }, [isPlaying, currentStep, onStepChange])

  const handlePlay = () => {
    setIsPlaying(true)
    // Trigger WebSocket connection and data generation when demo starts
    if (onStepChange) {
      // Notify parent component to start real-time data
      onStepChange({
        ...demoSteps[currentStep],
        action: () => {
          console.log("Demo started - activating real-time data feeds...")
          // This will be handled by the parent component
        },
      })
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setProgress(0)
    setStepProgress(0)
  }

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setStepProgress(0)
      setProgress((currentStep + 1) * (100 / demoSteps.length))
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setStepProgress(0)
      setProgress((currentStep - 1) * (100 / demoSteps.length))
    }
  }

  const currentDemoStep = demoSteps[currentStep]
  const isComplete = currentStep >= demoSteps.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Play className="h-5 w-5 mr-2 text-blue-400" />
            Invisible Shield Demo
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Interactive demonstration of our AI-powered fraud prevention system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Demo Progress</span>
              <span className="text-slate-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step */}
          {!isComplete && currentDemoStep && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <currentDemoStep.icon className="h-5 w-5 mr-2 text-blue-400" />
                  {currentDemoStep.title}
                </CardTitle>
                <CardDescription className="text-slate-400">{currentDemoStep.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Step Progress</span>
                    <span className="text-slate-400">{Math.round(stepProgress)}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-1" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Complete */}
          {isComplete && (
            <Alert className="border-green-500 bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-white">
                Demo completed! You've seen all the key features of Invisible Shield. Ready to prevent fraud at
                enterprise scale!
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Steps Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {demoSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                  index === currentStep
                    ? "bg-blue-900/30 border border-blue-500"
                    : index < currentStep
                      ? "bg-green-900/20 border border-green-500"
                      : "bg-slate-800/30 border border-slate-700"
                }`}
              >
                <step.icon
                  className={`h-4 w-4 ${
                    index === currentStep ? "text-blue-400" : index < currentStep ? "text-green-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={
                    index === currentStep
                      ? "text-white font-medium"
                      : index < currentStep
                        ? "text-green-300"
                        : "text-slate-400"
                  }
                >
                  {step.title}
                </span>
                {index === currentStep && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
                {index < currentStep && <CheckCircle className="h-3 w-3 text-green-400" />}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
              <Rewind className="h-4 w-4" />
            </Button>

            {!isPlaying ? (
              <Button onClick={handlePlay} disabled={isComplete} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                {currentStep === 0 ? "Start Demo" : "Resume"}
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleStop}>
              <Square className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep >= demoSteps.length - 1}>
              <FastForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Demo Info */}
          <div className="text-center text-sm text-slate-400">
            Step {currentStep + 1} of {demoSteps.length} • Total Duration: ~30 seconds
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
