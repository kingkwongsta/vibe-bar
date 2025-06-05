type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  action: string
  data?: Record<string, unknown>
  userId?: string
  sessionId: string
}

class Logger {
  private sessionId: string
  private isDev: boolean
  private logHistory: LogEntry[] = []
  private maxHistorySize: number = 50

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isDev = process.env.NODE_ENV === 'development'
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private createLogEntry(
    level: LogLevel,
    category: string,
    action: string,
    data?: Record<string, unknown>,
    userId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      data,
      userId,
      sessionId: this.sessionId
    }
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const emoji = {
      debug: '🔍',
      info: '📋',
      warn: '⚠️',
      error: '❌'
    }

    return `${emoji[entry.level]} [${entry.category}] ${entry.action} ${entry.data ? JSON.stringify(entry.data) : ''}`
  }

  // User action logging specifically for preferences
  logUserAction(action: string, data?: Record<string, unknown>, userId?: string) {
    this.log('info', 'user-action', action, data, userId)
  }

  // Preference selection logging
  logPreferenceSelection(preferenceType: string, value: unknown, operation: 'select' | 'deselect' | 'change') {
    const data = {
      preferenceType,
      value,
      operation,
      timestamp: Date.now()
    }
    
    this.logUserAction(`preference-${operation}`, data)
  }

  private log(level: LogLevel, category: string, action: string, data?: Record<string, unknown>, userId?: string) {
    const entry = this.createLogEntry(level, category, action, data, userId)
    
    // Add to history (keep only last N entries)
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(-this.maxHistorySize)
    }
    
    // Notify subscribers of new log
    this.notifyNewLog(entry)
    
    // Always log to console in development
    if (this.isDev) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
      console[consoleMethod](this.formatConsoleMessage(entry))
      
      // Also log the full object for debugging
      console.groupCollapsed(`📊 Full log details for: ${action}`)
      console.table(entry)
      console.groupEnd()
    }

    // In production, you could send to analytics service
    // this.sendToAnalytics(entry)
  }

  // Method to get current session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    }
  }

  // Method to manually trigger a log from dev tools
  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', 'manual', message, data)
  }

  // Methods for DevLogger to access log history
  getLogHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  clearLogHistory() {
    this.logHistory = []
  }

  // Method to subscribe to new logs
  onNewLog?: (entry: LogEntry) => void

  private notifyNewLog(entry: LogEntry) {
    if (this.onNewLog) {
      this.onNewLog(entry)
    }
  }
}

// Create singleton instance
export const logger = new Logger()

// Export types for use in components
export type { LogLevel, LogEntry } 