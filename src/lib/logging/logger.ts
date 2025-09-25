interface LogContext {
  [key: string]: any
  userId?: string
  component?: string
  message?: string
  stack?: string
  digest?: string
}

interface LogEntry {
  level: 'ERROR' | 'WARN' | 'INFO'
  message: string
  context: LogContext
  timestamp: string
}

class SimpleLogger {
  private static instance: SimpleLogger
  private logQueue: LogEntry[] = []
  private isClient: boolean

  static getInstance(): SimpleLogger {
    if (!SimpleLogger.instance) {
      SimpleLogger.instance = new SimpleLogger()
    }
    return SimpleLogger.instance
  }

  private constructor() {
    this.isClient = typeof window !== 'undefined'
    
    if (this.isClient) {
      this.setupBeforeUnloadHandler()
    }
  }

  private setupBeforeUnloadHandler() {
    const handleBeforeUnload = () => {
      if (this.logQueue.length > 0) {
        navigator.sendBeacon(
          '/api/logging/batch',
          new Blob([JSON.stringify({ logs: this.logQueue })], {
            type: 'application/json'
          })
        )
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  private createLogEntry(level: 'ERROR' | 'WARN' | 'INFO', message: string, context: LogContext = {}): LogEntry {
    return {
      level,
      message,
      context: {
        ...context,
        url: this.isClient ? window.location.href : context.url,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }
  }

  error(message: string, context: LogContext = {}) {
    const logEntry = this.createLogEntry('ERROR', message, context)
    
    console.error(`ERROR: ${message}`, context)
    this.addToQueue(logEntry)
    
    // 에러는 즉시 전송
    if (this.isClient) {
      this.flushLogs()
    }
  }

  warn(message: string, context: LogContext = {}) {
    const logEntry = this.createLogEntry('WARN', message, context)
    console.warn(`WARN: ${message}`, context)
    this.addToQueue(logEntry)
  }

  info(message: string, context: LogContext = {}) {
    const logEntry = this.createLogEntry('INFO', message, context)
    console.info(`INFO: ${message}`, context)
    this.addToQueue(logEntry)
  }

  private addToQueue(logEntry: LogEntry) {
    this.logQueue.push(logEntry)
    
    // 큐 크기 제한 (20개)
    if (this.logQueue.length > 20) {
      this.logQueue.shift()
    }
  }

  private async flushLogs() {
    if (this.logQueue.length === 0) return

    try {
      const logsToSend = [...this.logQueue]
      this.logQueue = []

      await fetch('/api/logging/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logsToSend })
      })
    } catch (error) {
      console.warn('Failed to flush logs:', error)
    }
  }
}

export const logger = SimpleLogger.getInstance()