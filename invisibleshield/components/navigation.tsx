"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Shield, Activity, Users, AlertTriangle, BarChart3, FileText, Menu, Play, Blocks } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Activity,
    description: "Real-time fraud monitoring",
  },
  {
    name: "Trust Passport",
    href: "/trust",
    icon: Users,
    description: "Customer trust scoring",
  },
  {
    name: "Blockchain",
    href: "/blockchain",
    icon: Blocks,
    description: "Immutable transaction ledger",
  },
  {
    name: "Monitor",
    href: "/monitor",
    icon: Shield,
    description: "Threat detection center",
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    description: "Security alerts management",
  },
  {
    name: "Insights",
    href: "/insights",
    icon: BarChart3,
    description: "Analytics and insights",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Security reports",
  },
]

interface NavigationProps {
  onStartDemo?: () => void
}

export function Navigation({ onStartDemo }: NavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Invisible Shield</span>
              <Badge variant="outline" className="text-xs">
                AI-Powered
              </Badge>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          pathname === item.href ? "bg-slate-800 text-white" : "text-slate-300",
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4 pl-4 border-l border-slate-700">
              <Button
                onClick={onStartDemo}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={onStartDemo}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-1" />
              Demo
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-slate-700">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center">
                    <Shield className="h-6 w-6 text-blue-400 mr-2" />
                    Invisible Shield
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">AI-Powered Fraud Prevention</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
