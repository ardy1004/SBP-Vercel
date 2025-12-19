// Analytics & User Behavior Tracking
// Comprehensive tracking system for user interactions and platform analytics

export interface UserEvent {
  id: string
  userId: string
  sessionId: string
  eventType: EventType
  eventData: Record<string, any>
  timestamp: Date
  page: string
  userAgent: string
  deviceInfo: DeviceInfo
}

export interface DeviceInfo {
  platform: string
  screenSize: { width: number; height: number }
  viewport: { width: number; height: number }
  pixelRatio: number
  touchSupport: boolean
  language: string
  timezone: string
}

export type EventType =
  | 'page_view'
  | 'search_performed'
  | 'property_view'
  | 'property_favorite'
  | 'property_unfavorite'
  | 'contact_initiated'
  | 'search_filter_applied'
  | 'image_gallery_opened'
  | 'virtual_tour_started'
  | 'share_performed'
  | 'save_search'
  | 'comparison_added'
  | 'comparison_removed'
  | 'form_submitted'
  | 'error_occurred'
  | 'performance_metric'

export interface AnalyticsReport {
  overview: {
    totalUsers: number
    totalSessions: number
    totalEvents: number
    averageSessionDuration: number
    bounceRate: number
  }
  userBehavior: {
    popularPages: Array<{ page: string; views: number }>
    popularSearches: Array<{ query: string; count: number }>
    propertyInteractions: Array<{ propertyId: string; views: number; favorites: number }>
    conversionFunnel: {
      searches: number
      propertyViews: number
      contacts: number
      conversions: number
    }
  }
  performance: {
    pageLoadTimes: Array<{ page: string; avgLoadTime: number }>
    errorRates: Array<{ error: string; count: number }>
    deviceBreakdown: Record<string, number>
  }
  timeRange: {
    start: Date
    end: Date
  }
}

export class AnalyticsTracker {
  private static instance: AnalyticsTracker
  private events: UserEvent[] = []
  private sessionId: string
  private userId: string | null = null

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker()
    }
    return AnalyticsTracker.instance
  }

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  /**
   * Initialize tracking system
   */
  private initializeTracking(): void {
    if (typeof window !== 'undefined') {
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        this.trackEvent('page_view', {
          action: document.hidden ? 'hidden' : 'visible',
          timeSpent: this.getTimeSpentOnPage()
        })
      })

      // Track page unload
      window.addEventListener('beforeunload', () => {
        this.trackEvent('page_view', {
          action: 'unload',
          timeSpent: this.getTimeSpentOnPage()
        })
      })

      // Track performance metrics
      this.trackPerformanceMetrics()
    }
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  /**
   * Track user event
   */
  trackEvent(eventType: EventType, eventData: Record<string, any> = {}): void {
    const event: UserEvent = {
      id: this.generateEventId(),
      userId: this.userId || 'anonymous',
      sessionId: this.sessionId,
      eventType,
      eventData,
      timestamp: new Date(),
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      deviceInfo: this.getDeviceInfo()
    }

    this.events.push(event)

    // Persist event (in production, send to analytics service)
    this.persistEvent(event)

    // Real-time processing for immediate insights
    this.processRealTimeEvent(event)
  }

  /**
   * Track page view
   */
  trackPageView(page: string, referrer?: string): void {
    this.trackEvent('page_view', {
      page,
      referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      title: typeof document !== 'undefined' ? document.title : ''
    })
  }

  /**
   * Track search interaction
   */
  trackSearch(query: string, filters: Record<string, any>, resultsCount: number): void {
    this.trackEvent('search_performed', {
      query,
      filters,
      resultsCount,
      searchType: query.length > 0 ? 'text' : 'filters'
    })
  }

  /**
   * Track property interaction
   */
  trackPropertyView(propertyId: string, source: string = 'listing'): void {
    this.trackEvent('property_view', {
      propertyId,
      source,
      timeSpent: 0 // Will be updated when user leaves
    })
  }

  /**
   * Track property favorite/unfavorite
   */
  trackPropertyFavorite(propertyId: string, action: 'favorite' | 'unfavorite'): void {
    this.trackEvent(action === 'favorite' ? 'property_favorite' : 'property_unfavorite', {
      propertyId,
      action
    })
  }

  /**
   * Track contact initiation
   */
  trackContactInitiated(propertyId: string, contactMethod: string): void {
    this.trackEvent('contact_initiated', {
      propertyId,
      contactMethod, // 'whatsapp', 'phone', 'email', 'form'
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Track search filter application
   */
  trackFilterApplied(filterType: string, filterValue: any): void {
    this.trackEvent('search_filter_applied', {
      filterType,
      filterValue,
      appliedAt: new Date().toISOString()
    })
  }

  /**
   * Track image gallery interactions
   */
  trackGalleryInteraction(propertyId: string, action: 'open' | 'close' | 'zoom' | 'fullscreen'): void {
    this.trackEvent('image_gallery_opened', {
      propertyId,
      action,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Track sharing actions
   */
  trackShare(propertyId: string, platform: string): void {
    this.trackEvent('share_performed', {
      propertyId,
      platform, // 'whatsapp', 'facebook', 'twitter', 'copy_link'
      sharedAt: new Date().toISOString()
    })
  }

  /**
   * Track form submissions
   */
  trackFormSubmission(formType: string, formData: Record<string, any>): void {
    this.trackEvent('form_submitted', {
      formType,
      formData: this.sanitizeFormData(formData),
      submittedAt: new Date().toISOString()
    })
  }

  /**
   * Track errors
   */
  trackError(error: Error, context: Record<string, any> = {}): void {
    this.trackEvent('error_occurred', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Generate analytics report
   */
  generateReport(timeRange?: { start: Date; end: Date }): AnalyticsReport {
    const { start, end } = timeRange || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }

    const filteredEvents = this.events.filter(event =>
      event.timestamp >= start && event.timestamp <= end
    )

    return {
      overview: this.generateOverview(filteredEvents),
      userBehavior: this.generateUserBehaviorReport(filteredEvents),
      performance: this.generatePerformanceReport(filteredEvents),
      timeRange: { start, end }
    }
  }

  /**
   * Get real-time insights
   */
  getRealTimeInsights(): {
    activeUsers: number
    currentPageViews: number
    topSearches: Array<{ query: string; count: number }>
    conversionRate: number
  } {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000)
    const recentEvents = this.events.filter(event => event.timestamp > lastHour)

    const activeUsers = new Set(recentEvents.map(e => e.userId)).size
    const pageViews = recentEvents.filter(e => e.eventType === 'page_view').length

    const searchEvents = recentEvents.filter(e => e.eventType === 'search_performed')
    const searchCounts: Record<string, number> = {}
    searchEvents.forEach(event => {
      const query = event.eventData.query || ''
      searchCounts[query] = (searchCounts[query] || 0) + 1
    })

    const topSearches = Object.entries(searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }))

    const searches = recentEvents.filter(e => e.eventType === 'search_performed').length
    const contacts = recentEvents.filter(e => e.eventType === 'contact_initiated').length
    const conversionRate = searches > 0 ? (contacts / searches) * 100 : 0

    return {
      activeUsers,
      currentPageViews: pageViews,
      topSearches,
      conversionRate
    }
  }

  /**
   * Export analytics data
   */
  exportData(): string {
    return JSON.stringify({
      events: this.events,
      exportedAt: new Date().toISOString(),
      totalEvents: this.events.length,
      dateRange: {
        earliest: this.events.length > 0 ? this.events[0].timestamp : null,
        latest: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null
      }
    }, null, 2)
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        platform: 'server',
        screenSize: { width: 1920, height: 1080 },
        viewport: { width: 1920, height: 1080 },
        pixelRatio: 1,
        touchSupport: false,
        language: 'id',
        timezone: 'Asia/Jakarta'
      }
    }

    return {
      platform: navigator.platform,
      screenSize: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      pixelRatio: window.devicePixelRatio || 1,
      touchSupport: 'ontouchstart' in window,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  private persistEvent(event: UserEvent): void {
    // In production, send to analytics service
    // For demo, store in localStorage with size limit
    if (typeof window !== 'undefined') {
      try {
        const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]')
        existingEvents.push(event)

        // Keep only last 1000 events to prevent storage bloat
        const trimmedEvents = existingEvents.slice(-1000)

        localStorage.setItem('analytics_events', JSON.stringify(trimmedEvents))
      } catch (error) {
        console.warn('Failed to persist analytics event:', error)
      }
    }
  }

  private processRealTimeEvent(event: UserEvent): void {
    // Real-time processing for immediate insights
    // Could trigger notifications, update dashboards, etc.
    console.log('Real-time event processed:', event.eventType, event.eventData)
  }

  private trackPerformanceMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navigation) {
            this.trackEvent('performance_metric', {
              metric: 'page_load_time',
              value: navigation.loadEventEnd - navigation.fetchStart,
              page: window.location.pathname
            })
          }
        }, 0)
      })

      // Track LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            this.trackEvent('performance_metric', {
              metric: 'lcp',
              value: lastEntry.startTime,
              page: window.location.pathname
            })
          })
          observer.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (error) {
          console.warn('LCP tracking not supported')
        }
      }
    }
  }

  private getTimeSpentOnPage(): number {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return Date.now() - (navigation ? navigation.fetchStart : window.performance.timing.fetchStart)
    }
    return 0
  }

  private sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(formData)) {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'string' && value.length > 100) {
        sanitized[key] = value.substring(0, 100) + '...'
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  private generateOverview(events: UserEvent[]): AnalyticsReport['overview'] {
    const uniqueUsers = new Set(events.map(e => e.userId)).size
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size
    const totalEvents = events.length

    // Calculate session durations (simplified)
    const sessionDurations: Record<string, { start: Date; end: Date }> = {}
    events.forEach(event => {
      if (!sessionDurations[event.sessionId]) {
        sessionDurations[event.sessionId] = { start: event.timestamp, end: event.timestamp }
      } else {
        if (event.timestamp < sessionDurations[event.sessionId].start) {
          sessionDurations[event.sessionId].start = event.timestamp
        }
        if (event.timestamp > sessionDurations[event.sessionId].end) {
          sessionDurations[event.sessionId].end = event.timestamp
        }
      }
    })

    const durations = Object.values(sessionDurations).map(s =>
      s.end.getTime() - s.start.getTime()
    )
    const averageSessionDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0

    // Calculate bounce rate (sessions with only 1 page view)
    const sessionPageViews: Record<string, number> = {}
    events.filter(e => e.eventType === 'page_view').forEach(event => {
      sessionPageViews[event.sessionId] = (sessionPageViews[event.sessionId] || 0) + 1
    })

    const bouncedSessions = Object.values(sessionPageViews).filter(views => views === 1).length
    const bounceRate = uniqueSessions > 0 ? (bouncedSessions / uniqueSessions) * 100 : 0

    return {
      totalUsers: uniqueUsers,
      totalSessions: uniqueSessions,
      totalEvents,
      averageSessionDuration,
      bounceRate
    }
  }

  private generateUserBehaviorReport(events: UserEvent[]): AnalyticsReport['userBehavior'] {
    // Popular pages
    const pageViews: Record<string, number> = {}
    events.filter(e => e.eventType === 'page_view').forEach(event => {
      pageViews[event.page] = (pageViews[event.page] || 0) + 1
    })

    const popularPages = Object.entries(pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // Popular searches
    const searchCounts: Record<string, number> = {}
    events.filter(e => e.eventType === 'search_performed').forEach(event => {
      const query = event.eventData.query || ''
      if (query) {
        searchCounts[query] = (searchCounts[query] || 0) + 1
      }
    })

    const popularSearches = Object.entries(searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))

    // Property interactions
    const propertyViewCounts: Record<string, number> = {}
    const propertyFavorites: Record<string, number> = {}

    events.filter(e => e.eventType === 'property_view').forEach(event => {
      const propertyId = event.eventData.propertyId
      if (propertyId) {
        propertyViewCounts[propertyId] = (propertyViewCounts[propertyId] || 0) + 1
      }
    })

    events.filter(e => ['property_favorite', 'property_unfavorite'].includes(e.eventType)).forEach(event => {
      const propertyId = event.eventData.propertyId
      if (propertyId) {
        propertyFavorites[propertyId] = (propertyFavorites[propertyId] || 0) + 1
      }
    })

    const propertyInteractions = Object.keys({ ...propertyViewCounts, ...propertyFavorites })
      .map(propertyId => ({
        propertyId,
        views: propertyViewCounts[propertyId] || 0,
        favorites: propertyFavorites[propertyId] || 0
      }))
      .sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites))
      .slice(0, 10)

    // Conversion funnel
    const searchCount = events.filter(e => e.eventType === 'search_performed').length
    const viewCount = events.filter(e => e.eventType === 'property_view').length
    const contactCount = events.filter(e => e.eventType === 'contact_initiated').length
    const conversionCount = events.filter(e => e.eventType === 'form_submitted').length

    return {
      popularPages,
      popularSearches,
      propertyInteractions,
      conversionFunnel: {
        searches: searchCount,
        propertyViews: viewCount,
        contacts: contactCount,
        conversions: conversionCount
      }
    }
  }

  private generatePerformanceReport(events: UserEvent[]): AnalyticsReport['performance'] {
    // Page load times
    const loadTimeEvents = events.filter(e =>
      e.eventType === 'performance_metric' && e.eventData.metric === 'page_load_time'
    )

    const pageLoadTimes: Record<string, number[]> = {}
    loadTimeEvents.forEach(event => {
      const page = event.eventData.page || 'unknown'
      if (!pageLoadTimes[page]) pageLoadTimes[page] = []
      pageLoadTimes[page].push(event.eventData.value)
    })

    const avgLoadTimes = Object.entries(pageLoadTimes).map(([page, times]) => ({
      page,
      avgLoadTime: times.reduce((a, b) => a + b, 0) / times.length
    })).sort((a, b) => b.avgLoadTime - a.avgLoadTime)

    // Error rates
    const errorEvents = events.filter(e => e.eventType === 'error_occurred')
    const errorCounts: Record<string, number> = {}
    errorEvents.forEach(event => {
      const errorKey = event.eventData.error?.message || 'Unknown error'
      errorCounts[errorKey] = (errorCounts[errorKey] || 0) + 1
    })

    const errorRates = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }))

    // Device breakdown
    const deviceBreakdown: Record<string, number> = {}
    events.forEach(event => {
      const platform = event.deviceInfo.platform || 'unknown'
      deviceBreakdown[platform] = (deviceBreakdown[platform] || 0) + 1
    })

    return {
      pageLoadTimes: avgLoadTimes,
      errorRates,
      deviceBreakdown
    }
  }
}

// Export singleton instance
export const analyticsTracker = AnalyticsTracker.getInstance()