"use client"

import { useState, useEffect } from "react"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Bug, ChevronDown, ChevronUp } from "lucide-react"

interface LogEntry {
  timestamp: string
  level: string
  category: string
  action: string
  data?: any
  sessionId: string
}

export function DevLogger() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const clearLogs = () => {
    setLogs([])
    console.clear()
  }

  const toggleLogger = () => {
    setIsOpen(!isOpen)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800'
      case 'warn': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'debug': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={toggleLogger}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 p-0 shadow-lg"
        title="Toggle Developer Logger"
      >
        <Bug className="h-5 w-5" />
      </Button>

      {/* Logger panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-96 max-h-96 z-40 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                <CardTitle className="text-sm">Dev Logger</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {logs.length} logs
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={clearLogs}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
                <Button
                  onClick={toggleLogger}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs">
              Real-time user preference tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 px-4 pb-4 overflow-y-auto">
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No logs yet. Start selecting preferences!
                  </p>
                ) : (
                  logs.slice(-10).reverse().map((log, index) => (
                    <div
                      key={`${log.timestamp}-${index}`}
                      className="text-xs border rounded p-2 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs px-1 py-0 ${getLevelColor(log.level)}`}>
                          {log.level}
                        </Badge>
                        <span className="text-gray-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <div className="font-medium">
                        [{log.category}] {log.action}
                      </div>
                      {log.data && (
                        <pre className="bg-gray-50 p-1 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// Hook to capture console logs (optional enhancement)
export function useLogCapture() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    // Intercept console logs that contain our logger format
    console.log = (...args) => {
      originalLog(...args)
      
      // Check if this is one of our structured logs
      const message = args[0]
      if (typeof message === 'string' && (message.includes('📋') || message.includes('🔍'))) {
        // This is a basic implementation - you could enhance this to parse the structured data
        const entry: LogEntry = {
          timestamp: new Date().toISOString(),
          level: 'info',
          category: 'captured',
          action: message,
          sessionId: logger.getSessionInfo().sessionId
        }
        setLogs(prev => [...prev.slice(-49), entry]) // Keep last 50 logs
      }
    }

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return { logs, clearLogs: () => setLogs([]) }
} 