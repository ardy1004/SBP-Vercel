// Production Monitoring & Analytics System
// Comprehensive monitoring for production deployment

export interface SystemMetrics {
  timestamp: Date
  responseTime: number
  errorRate: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  activeConnections: number
}

export interface BusinessMetrics {
  timestamp: Date
  pageViews: number
  uniqueVisitors: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topSearches: Array<{ query: string; count: number }>
  revenueMetrics?: {
    totalValue: number
    conversionValue: number
    averageOrderValue: number
  }
}

export interface AlertConfig {
  id: string
  name: string
  condition: (metrics: SystemMetrics | BusinessMetrics) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  cooldown: number // minutes
  enabled: boolean
}

export interface Alert {
  id: string
  configId: string
  timestamp: Date
  severity: AlertConfig['severity']
  message: string
  metrics: any
  resolved: boolean
  resolvedAt?: Date
}

export class MonitoringSystem {
  private static instance: MonitoringSystem
  private metrics: SystemMetrics[] = []
  private businessMetrics: BusinessMetrics[] = []
  private alerts: Alert[] = []
  private alertConfigs: AlertConfig[] = []
  private alertCooldowns: Map<string, Date> = new Map()

  public static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem()
    }
    return MonitoringSystem.instance
  }

  constructor() {
    this.initializeDefaultAlerts()
    this.startMetricsCollection()
  }

  /**
   * Record system performance metrics
   */
  recordSystemMetrics(metrics: Omit<SystemMetrics, 'timestamp'>): void {
    const systemMetrics: SystemMetrics = {
      ...metrics,
      timestamp: new Date()
    }

    this.metrics.push(systemMetrics)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Check for alerts
    this.checkSystemAlerts(systemMetrics)
  }

  /**
   * Record business metrics
   */
  recordBusinessMetrics(metrics: Omit<BusinessMetrics, 'timestamp'>): void {
    const businessMetric: BusinessMetrics = {
      ...metrics,
      timestamp: new Date()
    }

    this.businessMetrics.push(businessMetric)

    // Keep only last 1000 business metrics
    if (this.businessMetrics.length > 1000) {
      this.businessMetrics = this.businessMetrics.slice(-1000)
    }

    // Check for alerts
    this.checkBusinessAlerts(businessMetric)
  }

  /**
   * Get current system health status
   */
  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical'
    uptime: number
    responseTime: number
    errorRate: number
    activeAlerts: Alert[]
  } {
    const recentMetrics = this.getRecentMetrics(5) // Last 5 minutes
    const activeAlerts = this.alerts.filter(a => !a.resolved)

    if (activeAlerts.some(a => a.severity === 'critical')) {
      return {
        status: 'critical',
        uptime: this.calculateUptime(),
        responseTime: recentMetrics.avgResponseTime,
        errorRate: recentMetrics.avgErrorRate,
        activeAlerts
      }
    }

    if (activeAlerts.some(a => a.severity === 'high') || recentMetrics.avgErrorRate > 5) {
      return {
        status: 'warning',
        uptime: this.calculateUptime(),
        responseTime: recentMetrics.avgResponseTime,
        errorRate: recentMetrics.avgErrorRate,
        activeAlerts
      }
    }

    return {
      status: 'healthy',
      uptime: this.calculateUptime(),
      responseTime: recentMetrics.avgResponseTime,
      errorRate: recentMetrics.avgErrorRate,
      activeAlerts
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(timeRange: { start: Date; end: Date }): {
    systemMetrics: {
      avgResponseTime: number
      avgErrorRate: number
      peakThroughput: number
      avgMemoryUsage: number
      avgCpuUsage: number
    }
    businessMetrics: {
      totalPageViews: number
      totalUniqueVisitors: number
      avgConversionRate: number
      avgSessionDuration: number
      topPages: Array<{ page: string; views: number }>
      topSearches: Array<{ query: string; count: number }>
    }
    alerts: Alert[]
  } {
    const systemMetrics = this.metrics.filter(m =>
      m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    )

    const businessMetrics = this.businessMetrics.filter(m =>
      m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    )

    const alerts = this.alerts.filter(a =>
      a.timestamp >= timeRange.start && a.timestamp <= timeRange.end
    )

    return {
      systemMetrics: {
        avgResponseTime: systemMetrics.length > 0
          ? systemMetrics.reduce((sum, m) => sum + m.responseTime, 0) / systemMetrics.length
          : 0,
        avgErrorRate: systemMetrics.length > 0
          ? systemMetrics.reduce((sum, m) => sum + m.errorRate, 0) / systemMetrics.length
          : 0,
        peakThroughput: systemMetrics.length > 0
          ? Math.max(...systemMetrics.map(m => m.throughput))
          : 0,
        avgMemoryUsage: systemMetrics.length > 0
          ? systemMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / systemMetrics.length
          : 0,
        avgCpuUsage: systemMetrics.length > 0
          ? systemMetrics.reduce((sum, m) => sum + m.cpuUsage, 0) / systemMetrics.length
          : 0
      },
      businessMetrics: {
        totalPageViews: businessMetrics.reduce((sum, m) => sum + m.pageViews, 0),
        totalUniqueVisitors: businessMetrics.reduce((sum, m) => sum + m.uniqueVisitors, 0),
        avgConversionRate: businessMetrics.length > 0
          ? businessMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / businessMetrics.length
          : 0,
        avgSessionDuration: businessMetrics.length > 0
          ? businessMetrics.reduce((sum, m) => sum + m.averageSessionDuration, 0) / businessMetrics.length
          : 0,
        topPages: this.aggregateTopPages(businessMetrics),
        topSearches: this.aggregateTopSearches(businessMetrics)
      },
      alerts
    }
  }

  /**
   * Configure custom alerts
   */
  addAlertConfig(config: AlertConfig): void {
    this.alertConfigs.push(config)
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedAt = new Date()
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved)
  }

  /**
   * Export monitoring data
   */
  exportData(): {
    systemMetrics: SystemMetrics[]
    businessMetrics: BusinessMetrics[]
    alerts: Alert[]
    alertConfigs: AlertConfig[]
  } {
    return {
      systemMetrics: this.metrics,
      businessMetrics: this.businessMetrics,
      alerts: this.alerts,
      alertConfigs: this.alertConfigs
    }
  }

  private initializeDefaultAlerts(): void {
    // System alerts
    this.alertConfigs.push(
      {
        id: 'high_response_time',
        name: 'High Response Time',
        condition: (metrics) => (metrics as SystemMetrics).responseTime > 3000,
        severity: 'high',
        message: 'Average response time exceeded 3 seconds',
        cooldown: 5,
        enabled: true
      },
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        condition: (metrics) => (metrics as SystemMetrics).errorRate > 5,
        severity: 'critical',
        message: 'Error rate exceeded 5%',
        cooldown: 2,
        enabled: true
      },
      {
        id: 'high_memory_usage',
        name: 'High Memory Usage',
        condition: (metrics) => (metrics as SystemMetrics).memoryUsage > 80,
        severity: 'medium',
        message: 'Memory usage exceeded 80%',
        cooldown: 10,
        enabled: true
      },
      {
        id: 'high_cpu_usage',
        name: 'High CPU Usage',
        condition: (metrics) => (metrics as SystemMetrics).cpuUsage > 90,
        severity: 'high',
        message: 'CPU usage exceeded 90%',
        cooldown: 5,
        enabled: true
      }
    )

    // Business alerts
    this.alertConfigs.push(
      {
        id: 'low_conversion_rate',
        name: 'Low Conversion Rate',
        condition: (metrics) => (metrics as BusinessMetrics).conversionRate < 1,
        severity: 'medium',
        message: 'Conversion rate dropped below 1%',
        cooldown: 30,
        enabled: true
      },
      {
        id: 'high_bounce_rate',
        name: 'High Bounce Rate',
        condition: (metrics) => (metrics as BusinessMetrics).bounceRate > 70,
        severity: 'medium',
        message: 'Bounce rate exceeded 70%',
        cooldown: 15,
        enabled: true
      }
    )
  }

  private startMetricsCollection(): void {
    // Collect system metrics every minute
    setInterval(() => {
      this.collectSystemMetrics()
    }, 60000)

    // Collect business metrics every 5 minutes
    setInterval(() => {
      this.collectBusinessMetrics()
    }, 300000)
  }

  private async collectSystemMetrics(): Promise<void> {
    try {
      // In a real implementation, this would collect actual system metrics
      // For demo purposes, we'll simulate metrics
      const metrics: Omit<SystemMetrics, 'timestamp'> = {
        responseTime: Math.random() * 1000 + 500, // 500-1500ms
        errorRate: Math.random() * 2, // 0-2%
        throughput: Math.floor(Math.random() * 1000) + 500, // 500-1500 req/min
        memoryUsage: Math.random() * 30 + 50, // 50-80%
        cpuUsage: Math.random() * 40 + 30, // 30-70%
        activeConnections: Math.floor(Math.random() * 500) + 100 // 100-600
      }

      this.recordSystemMetrics(metrics)
    } catch (error) {
      console.error('Failed to collect system metrics:', error)
    }
  }

  private async collectBusinessMetrics(): Promise<void> {
    try {
      // In a real implementation, this would aggregate from analytics data
      // For demo purposes, we'll simulate business metrics
      const metrics: Omit<BusinessMetrics, 'timestamp'> = {
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 2000) + 1000,
        conversionRate: Math.random() * 5 + 1, // 1-6%
        averageSessionDuration: Math.random() * 300 + 120, // 2-7 minutes
        bounceRate: Math.random() * 30 + 40, // 40-70%
        topPages: [
          { page: '/', views: Math.floor(Math.random() * 2000) + 1000 },
          { page: '/properties', views: Math.floor(Math.random() * 1500) + 800 },
          { page: '/about', views: Math.floor(Math.random() * 500) + 200 }
        ],
        topSearches: [
          { query: 'rumah jakarta', count: Math.floor(Math.random() * 200) + 100 },
          { query: 'apartemen murah', count: Math.floor(Math.random() * 150) + 80 },
          { query: 'villa bali', count: Math.floor(Math.random() * 100) + 50 }
        ]
      }

      this.recordBusinessMetrics(metrics)
    } catch (error) {
      console.error('Failed to collect business metrics:', error)
    }
  }

  private checkSystemAlerts(metrics: SystemMetrics): void {
    this.alertConfigs.forEach(config => {
      if (!config.enabled) return

      const lastAlert = this.alertCooldowns.get(config.id)
      if (lastAlert && (Date.now() - lastAlert.getTime()) < (config.cooldown * 60 * 1000)) {
        return // Still in cooldown
      }

      if (config.condition(metrics)) {
        const alert: Alert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          configId: config.id,
          timestamp: new Date(),
          severity: config.severity,
          message: config.message,
          metrics,
          resolved: false
        }

        this.alerts.push(alert)
        this.alertCooldowns.set(config.id, new Date())

        // In production, this would trigger notifications
        console.warn(`🚨 ALERT [${config.severity.toUpperCase()}]: ${config.message}`)
      }
    })
  }

  private checkBusinessAlerts(metrics: BusinessMetrics): void {
    this.alertConfigs.forEach(config => {
      if (!config.enabled) return

      const lastAlert = this.alertCooldowns.get(config.id)
      if (lastAlert && (Date.now() - lastAlert.getTime()) < (config.cooldown * 60 * 1000)) {
        return // Still in cooldown
      }

      if (config.condition(metrics)) {
        const alert: Alert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          configId: config.id,
          timestamp: new Date(),
          severity: config.severity,
          message: config.message,
          metrics,
          resolved: false
        }

        this.alerts.push(alert)
        this.alertCooldowns.set(config.id, new Date())

        // In production, this would trigger notifications
        console.warn(`🚨 BUSINESS ALERT [${config.severity.toUpperCase()}]: ${config.message}`)
      }
    })
  }

  private getRecentMetrics(minutes: number): {
    avgResponseTime: number
    avgErrorRate: number
    avgThroughput: number
  } {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff)

    if (recentMetrics.length === 0) {
      return { avgResponseTime: 0, avgErrorRate: 0, avgThroughput: 0 }
    }

    return {
      avgResponseTime: recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length,
      avgErrorRate: recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length,
      avgThroughput: recentMetrics.reduce((sum, m) => sum + m.throughput, 0) / recentMetrics.length
    }
  }

  private calculateUptime(): number {
    // Simplified uptime calculation
    // In production, this would track actual service uptime
    return 99.9 // Placeholder
  }

  private aggregateTopPages(businessMetrics: BusinessMetrics[]): Array<{ page: string; views: number }> {
    const pageMap: Record<string, number> = {}

    businessMetrics.forEach(metric => {
      metric.topPages.forEach(page => {
        pageMap[page.page] = (pageMap[page.page] || 0) + page.views
      })
    })

    return Object.entries(pageMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))
  }

  private aggregateTopSearches(businessMetrics: BusinessMetrics[]): Array<{ query: string; count: number }> {
    const searchMap: Record<string, number> = {}

    businessMetrics.forEach(metric => {
      metric.topSearches.forEach(search => {
        searchMap[search.query] = (searchMap[search.query] || 0) + search.count
      })
    })

    return Object.entries(searchMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))
  }
}

// Export singleton instance
export const monitoringSystem = MonitoringSystem.getInstance()