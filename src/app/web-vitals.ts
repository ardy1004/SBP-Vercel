import type { NextWebVitalsMetric } from 'next/app'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric)
  }

  // Send to analytics service in production
  // You can send to Google Analytics, Vercel Analytics, or any other service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        custom_map: { metric_value: metric.value },
        non_interaction: true,
      })
    }

    // Example: Send to Vercel Analytics (if using)
    // import { track } from '@vercel/analytics'
    // track(`Web Vitals - ${metric.name}`, { value: metric.value })

    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metric),
    // })
  }
}