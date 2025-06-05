"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, BarChart3, Clock, Zap } from 'lucide-react'

interface PerformanceData {
  componentName: string
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  totalRenderTime: number
  timestamp: number
}

// Global performance store
class PerformanceStore {
  private data: Map<string, PerformanceData> = new Map()
  private listeners: Set<() => void> = new Set()

  addMetric(componentName: string, renderTime: number) {
    const existing = this.data.get(componentName)
    const now = Date.now()

    if (existing) {
      const newRenderCount = existing.renderCount + 1
      const newTotalTime = existing.totalRenderTime + renderTime
      
      this.data.set(componentName, {
        componentName,
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newTotalTime / newRenderCount,
        totalRenderTime: newTotalTime,
        timestamp: now,
      })
    } else {
      this.data.set(componentName, {
        componentName,
        renderCount: 1,
        lastRenderTime: renderTime,
        averageRenderTime: renderTime,
        totalRenderTime: renderTime,
        timestamp: now,
      })
    }

    this.notifyListeners()
  }

  getAllMetrics(): PerformanceData[] {
    return Array.from(this.data.values()).sort((a, b) => b.timestamp - a.timestamp)
  }

  clearMetrics() {
    this.data.clear()
    this.notifyListeners()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}

export const performanceStore = new PerformanceStore()

// Performance monitoring component
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceData[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [webVitals, setWebVitals] = useState<{
    fcp?: number
    lcp?: number
    cls?: number
    fid?: number
  }>({})

  useEffect(() => {
    const unsubscribe = performanceStore.subscribe(() => {
      setMetrics(performanceStore.getAllMetrics())
    })

    // Initial load
    setMetrics(performanceStore.getAllMetrics())

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Monitor Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcp) {
          setWebVitals(prev => ({ ...prev, fcp: fcp.startTime }))
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          setWebVitals(prev => ({ ...prev, lcp: lastEntry.startTime }))
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        setWebVitals(prev => ({ ...prev, cls: clsValue }))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const formatTime = (time: number) => `${time.toFixed(2)}ms`
  const getPerformanceColor = (time: number) => {
    if (time < 16) return 'bg-green-100 text-green-800'
    if (time < 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getWebVitalColor = (metric: string, value: number) => {
    switch (metric) {
      case 'fcp':
        return value < 1800 ? 'text-green-600' : value < 3000 ? 'text-yellow-600' : 'text-red-600'
      case 'lcp':
        return value < 2500 ? 'text-green-600' : value < 4000 ? 'text-yellow-600' : 'text-red-600'
      case 'cls':
        return value < 0.1 ? 'text-green-600' : value < 0.25 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700"
        size="sm"
      >
        <Activity className="h-4 w-4 mr-1" />
        Perf
      </Button>

      {/* Performance Panel */}
      {isVisible && (
        <Card className="fixed bottom-16 right-4 w-96 max-h-96 overflow-auto z-50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Performance Monitor
              </span>
              <Button
                onClick={() => performanceStore.clearMetrics()}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Web Vitals */}
            <div>
              <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Web Vitals
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {webVitals.fcp && (
                  <div className={`${getWebVitalColor('fcp', webVitals.fcp)}`}>
                    FCP: {formatTime(webVitals.fcp)}
                  </div>
                )}
                {webVitals.lcp && (
                  <div className={`${getWebVitalColor('lcp', webVitals.lcp)}`}>
                    LCP: {formatTime(webVitals.lcp)}
                  </div>
                )}
                {webVitals.cls !== undefined && (
                  <div className={`${getWebVitalColor('cls', webVitals.cls)}`}>
                    CLS: {webVitals.cls.toFixed(3)}
                  </div>
                )}
              </div>
            </div>

            {/* Component Metrics */}
            <div>
              <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Component Renders
              </h4>
              <div className="space-y-2 max-h-48 overflow-auto">
                {metrics.length === 0 ? (
                  <p className="text-xs text-gray-500">No metrics yet</p>
                ) : (
                  metrics.map((metric) => (
                    <div key={metric.componentName} className="text-xs border rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium truncate">{metric.componentName}</span>
                        <Badge variant="outline" className="text-xs">
                          {metric.renderCount}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className={`px-1 rounded text-xs ${getPerformanceColor(metric.lastRenderTime)}`}>
                          Last: {formatTime(metric.lastRenderTime)}
                        </span>
                        <span className={`px-1 rounded text-xs ${getPerformanceColor(metric.averageRenderTime)}`}>
                          Avg: {formatTime(metric.averageRenderTime)}
                        </span>
                      </div>
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