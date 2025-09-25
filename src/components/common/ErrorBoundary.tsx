'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logging/logger'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  componentName?: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Error Boundary: ${this.props.componentName || 'Unknown'}`, {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      component: this.props.componentName
    })
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-2">
                컴포넌트 오류가 발생했습니다
              </h3>
              <p className="text-sm text-red-600 mb-4">
                {this.state.error.message}
              </p>
              <button
                onClick={this.retry}
                className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary