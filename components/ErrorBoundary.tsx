'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="bg-gray-50 p-3 rounded-lg">
              <summary className="cursor-pointer font-medium text-gray-700">
                Detail Error (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button
              onClick={resetError}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const ErrorBoundary = ErrorBoundaryComponent