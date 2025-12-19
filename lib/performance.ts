// Performance monitoring utilities for Salam Bumi Property

declare global {
  function gtag(...args: any[]): void
}

export interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  pageLoad: number | null // Page load time
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('[Performance] FCP:', entry.startTime, 'ms')
        // Send to analytics
        sendToAnalytics('FCP', entry.startTime)
      }
    }
  }).observe({ entryTypes: ['paint'] })

  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('[Performance] LCP:', entry.startTime, 'ms')
      sendToAnalytics('LCP', entry.startTime)
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = (entry as any).processingStart - entry.startTime
      console.log('[Performance] FID:', fid, 'ms')
      sendToAnalytics('FID', fid)
    }
  }).observe({ entryTypes: ['first-input'] })

  // Cumulative Layout Shift
  new PerformanceObserver((list) => {
    let clsValue = 0
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
      }
    }
    console.log('[Performance] CLS:', clsValue)
    sendToAnalytics('CLS', clsValue)
  }).observe({ entryTypes: ['layout-shift'] })

  // Navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart
        const pageLoad = navigation.loadEventEnd - navigation.fetchStart

        console.log('[Performance] TTFB:', ttfb, 'ms')
        console.log('[Performance] Page Load:', pageLoad, 'ms')

        sendToAnalytics('TTFB', ttfb)
        sendToAnalytics('PageLoad', pageLoad)
      }
    }, 0)
  })
}

// Send performance data to analytics
function sendToAnalytics(metric: string, value: number) {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric,
        value: Math.round(value),
        custom_map: { metric_value: value }
      })
    }

    // Example: Custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric, value, timestamp: Date.now() })
    }).catch(() => {
      // Silently fail if analytics endpoint is unavailable
    })
  }
}

// Resource loading performance
export function trackResourceLoading() {
  if (typeof window === 'undefined') return

  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const resourceEntry = entry as PerformanceResourceTiming

      // Track slow resources (> 2 seconds)
      if (resourceEntry.duration > 2000) {
        console.warn('[Performance] Slow resource:', resourceEntry.name, resourceEntry.duration, 'ms')
        sendToAnalytics('SlowResource', resourceEntry.duration)
      }

      // Track failed resources
      if (resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize === 0) {
        console.error('[Performance] Failed resource:', resourceEntry.name)
      }
    }
  }).observe({ entryTypes: ['resource'] })
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) return

  let memoryCheckCount = 0
  const maxMemoryChecks = 10 // Limit memory checks to prevent performance impact

  const checkMemory = () => {
    if (memoryCheckCount >= maxMemoryChecks) {
      console.log('[Performance] Memory monitoring stopped after', maxMemoryChecks, 'checks')
      return
    }

    memoryCheckCount++
    const memory = (performance as any).memory
    const usedPercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100

    // Only log if memory usage is concerning (> 85%)
    if (usedPercent > 85) {
      console.warn('[Performance] High memory usage detected:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        percent: Math.round(usedPercent)
      })
      sendToAnalytics('HighMemoryUsage', usedPercent)

      // Suggest garbage collection if available
      if ((window as any).gc) {
        console.log('[Performance] Triggering garbage collection...')
        ;(window as any).gc()
      }
    }
  }

  // Check memory every 60 seconds (reduced frequency)
  const memoryCheckInterval = setInterval(checkMemory, 60000)

  // Initial check after a delay
  setTimeout(checkMemory, 5000)

  // Cleanup function
  return () => {
    clearInterval(memoryCheckInterval)
  }
}

// User interaction tracking
export function trackUserInteractions() {
  if (typeof window === 'undefined') return

  let interactionCount = 0
  const maxInteractions = 100

  const trackInteraction = (event: Event) => {
    interactionCount++

    // Send batch of interactions every 50 interactions
    if (interactionCount % 50 === 0) {
      sendToAnalytics('UserInteractions', interactionCount)
    }

    // Stop tracking after max interactions to avoid performance impact
    if (interactionCount >= maxInteractions) {
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('keydown', trackInteraction)
      document.removeEventListener('scroll', trackInteraction)
    }
  }

  document.addEventListener('click', trackInteraction, { passive: true })
  document.addEventListener('keydown', trackInteraction, { passive: true })
  document.addEventListener('scroll', trackInteraction, { passive: true })
}

// Error tracking
export function trackErrors() {
  if (typeof window === 'undefined') return

  window.addEventListener('error', (event) => {
    console.error('[Error Tracking]', event.error)
    sendToAnalytics('JavaScriptError', 1)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Error Tracking] Unhandled promise rejection:', event.reason)
    sendToAnalytics('UnhandledRejection', 1)
  })
}

// Initialize all performance tracking
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  console.log('[Performance] Initializing performance monitoring...')

  trackWebVitals()
  trackResourceLoading()
  trackMemoryUsage()
  trackUserInteractions()
  trackErrors()

  console.log('[Performance] Performance monitoring initialized')
}

// Utility to measure function execution time
export function measureExecutionTime<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  console.log(`[Performance] ${label}:`, end - start, 'ms')
  return result
}

// Async function execution time measurement
export async function measureAsyncExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()

  console.log(`[Performance] ${label}:`, end - start, 'ms')
  return result
}