'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { initializePerformanceMonitoring } from '../lib/performance'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  }))

  // Initialize performance monitoring
  useEffect(() => {
    // Prevent multiple initializations
    if (typeof window !== 'undefined' && !(window as any).__performanceInitialized) {
      (window as any).__performanceInitialized = true
      initializePerformanceMonitoring()
    }
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}