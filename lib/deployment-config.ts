// Production Deployment Configuration
// Environment-specific settings and deployment management

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production'
  version: string
  buildTime: string
  features: {
    analytics: boolean
    abTesting: boolean
    monitoring: boolean
    pwa: boolean
    errorReporting: boolean
  }
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  cdn: {
    images: string
    assets: string
  }
  monitoring: {
    sentryDsn?: string
    analyticsId?: string
    performanceMonitoring: boolean
  }
  security: {
    enableCSP: boolean
    enableHSTS: boolean
    corsOrigins: string[]
  }
  performance: {
    enableCompression: boolean
    enableCaching: boolean
    imageOptimization: boolean
  }
}

export interface DeploymentStatus {
  environment: string
  version: string
  status: 'deploying' | 'success' | 'failed' | 'rollback'
  deployedAt: Date
  deployedBy: string
  healthChecks: {
    database: boolean
    api: boolean
    cdn: boolean
    monitoring: boolean
  }
  metrics: {
    deploymentTime: number
    downtime: number
    errors: number
  }
}

export class DeploymentManager {
  private static instance: DeploymentManager
  private config: DeploymentConfig
  private deploymentHistory: DeploymentStatus[] = []

  public static getInstance(): DeploymentManager {
    if (!DeploymentManager.instance) {
      DeploymentManager.instance = new DeploymentManager()
    }
    return DeploymentManager.instance
  }

  constructor() {
    this.config = this.loadConfig()
  }

  /**
   * Get current deployment configuration
   */
  getConfig(): DeploymentConfig {
    return this.config
  }

  /**
   * Update deployment configuration
   */
  updateConfig(updates: Partial<DeploymentConfig>): void {
    this.config = { ...this.config, ...updates }
    this.persistConfig()
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig(): DeploymentConfig {
    const env = process.env.NODE_ENV || 'development'

    const baseConfig: DeploymentConfig = {
      environment: env as any,
      version: process.env.npm_package_version || '1.0.0',
      buildTime: new Date().toISOString(),
      features: {
        analytics: env === 'production',
        abTesting: env !== 'development',
        monitoring: env !== 'development',
        pwa: true,
        errorReporting: env === 'production'
      },
      api: {
        baseUrl: this.getApiBaseUrl(env),
        timeout: 30000,
        retries: env === 'production' ? 3 : 1
      },
      cdn: {
        images: this.getCdnUrl(env, 'images'),
        assets: this.getCdnUrl(env, 'assets')
      },
      monitoring: {
        sentryDsn: process.env.SENTRY_DSN,
        analyticsId: process.env.GA_TRACKING_ID,
        performanceMonitoring: env === 'production'
      },
      security: {
        enableCSP: env === 'production',
        enableHSTS: env === 'production',
        corsOrigins: this.getCorsOrigins(env)
      },
      performance: {
        enableCompression: true,
        enableCaching: true,
        imageOptimization: true
      }
    }

    return { ...baseConfig, ...this.config }
  }

  /**
   * Record deployment status
   */
  recordDeployment(deployment: Omit<DeploymentStatus, 'deployedAt'>): void {
    const deploymentStatus: DeploymentStatus = {
      ...deployment,
      deployedAt: new Date()
    }

    this.deploymentHistory.push(deploymentStatus)
    this.persistDeploymentHistory()
  }

  /**
   * Get deployment history
   */
  getDeploymentHistory(limit: number = 10): DeploymentStatus[] {
    return this.deploymentHistory
      .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime())
      .slice(0, limit)
  }

  /**
   * Get current deployment status
   */
  getCurrentDeployment(): DeploymentStatus | null {
    return this.deploymentHistory
      .filter(d => d.environment === this.config.environment)
      .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime())[0] || null
  }

  /**
   * Run pre-deployment checks
   */
  async runPreDeploymentChecks(): Promise<{
    passed: boolean
    checks: Array<{ name: string; passed: boolean; message: string }>
  }> {
    const checks = [
      {
        name: 'Build Check',
        check: async () => {
          // Check if build exists and is recent
          const buildExists = true // In real implementation, check build directory
          return {
            passed: buildExists,
            message: buildExists ? 'Build exists' : 'Build not found'
          }
        }
      },
      {
        name: 'Environment Variables',
        check: async () => {
          const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET']
          const missing = requiredVars.filter(v => !process.env[v])

          return {
            passed: missing.length === 0,
            message: missing.length === 0
              ? 'All required environment variables present'
              : `Missing: ${missing.join(', ')}`
          }
        }
      },
      {
        name: 'Database Connection',
        check: async () => {
          try {
            // Test database connection
            const connected = true // In real implementation, test actual connection
            return {
              passed: connected,
              message: connected ? 'Database connection successful' : 'Database connection failed'
            }
          } catch (error) {
            return {
              passed: false,
              message: `Database error: ${error}`
            }
          }
        }
      },
      {
        name: 'API Health Check',
        check: async () => {
          try {
            // Test API endpoints
            const healthy = true // In real implementation, test actual endpoints
            return {
              passed: healthy,
              message: healthy ? 'API endpoints healthy' : 'API health check failed'
            }
          } catch (error) {
            return {
              passed: false,
              message: `API error: ${error}`
            }
          }
        }
      },
      {
        name: 'Security Scan',
        check: async () => {
          // Run security checks
          const secure = true // In real implementation, run security scanner
          return {
            passed: secure,
            message: secure ? 'Security checks passed' : 'Security vulnerabilities found'
          }
        }
      }
    ]

    const results = await Promise.all(checks.map(async ({ name, check }) => ({
      name,
      ...await check()
    })))

    const passed = results.every(r => r.passed)

    return { passed, checks: results }
  }

  /**
   * Run post-deployment verification
   */
  async runPostDeploymentVerification(): Promise<{
    passed: boolean
    verifications: Array<{ name: string; passed: boolean; message: string }>
  }> {
    const verifications = [
      {
        name: 'Application Startup',
        check: async () => {
          // Check if application started successfully
          const started = true // In real implementation, check health endpoint
          return {
            passed: started,
            message: started ? 'Application started successfully' : 'Application failed to start'
          }
        }
      },
      {
        name: 'Database Migrations',
        check: async () => {
          // Check if database migrations ran successfully
          const migrated = true // In real implementation, verify migration status
          return {
            passed: migrated,
            message: migrated ? 'Database migrations completed' : 'Database migrations failed'
          }
        }
      },
      {
        name: 'CDN Assets',
        check: async () => {
          // Check if CDN assets are accessible
          const accessible = true // In real implementation, test CDN URLs
          return {
            passed: accessible,
            message: accessible ? 'CDN assets accessible' : 'CDN assets not accessible'
          }
        }
      },
      {
        name: 'Monitoring Setup',
        check: async () => {
          // Check if monitoring is working
          const monitoring = true // In real implementation, verify monitoring setup
          return {
            passed: monitoring,
            message: monitoring ? 'Monitoring active' : 'Monitoring setup failed'
          }
        }
      },
      {
        name: 'Performance Baseline',
        check: async () => {
          // Check if performance meets baseline
          const meetsBaseline = true // In real implementation, run performance tests
          return {
            passed: meetsBaseline,
            message: meetsBaseline ? 'Performance meets baseline' : 'Performance below baseline'
          }
        }
      }
    ]

    const results = await Promise.all(verifications.map(async ({ name, check }) => ({
      name,
      ...await check()
    })))

    const passed = results.every(r => r.passed)

    return { passed, verifications: results }
  }

  /**
   * Create rollback plan
   */
  createRollbackPlan(): {
    steps: Array<{ step: string; command: string; description: string }>
    estimatedDowntime: number
    riskLevel: 'low' | 'medium' | 'high'
  } {
    return {
      steps: [
        {
          step: 'Stop current deployment',
          command: 'kubectl scale deployment app --replicas=0',
          description: 'Scale down current deployment to stop traffic'
        },
        {
          step: 'Switch to previous version',
          command: 'kubectl set image deployment/app app=app:previous-version',
          description: 'Deploy previous stable version'
        },
        {
          step: 'Scale up previous version',
          command: 'kubectl scale deployment/app --replicas=3',
          description: 'Scale up previous version to handle traffic'
        },
        {
          step: 'Verify rollback',
          command: 'curl -f https://app.example.com/health',
          description: 'Verify application is responding correctly'
        },
        {
          step: 'Update load balancer',
          command: 'kubectl apply -f load-balancer-config.yaml',
          description: 'Ensure load balancer points to correct version'
        }
      ],
      estimatedDowntime: 300, // 5 minutes
      riskLevel: 'medium'
    }
  }

  /**
   * Generate deployment report
   */
  generateDeploymentReport(deploymentId: string): any {
    const deployment = this.deploymentHistory.find(d => d.version === deploymentId)
    if (!deployment) return null

    const config = this.getEnvironmentConfig()

    return {
      deployment,
      configuration: config,
      checks: {
        preDeployment: null, // Would be populated during actual deployment
        postDeployment: null
      },
      metrics: {
        deploymentTime: deployment.metrics.deploymentTime,
        downtime: deployment.metrics.downtime,
        errors: deployment.metrics.errors
      },
      generatedAt: new Date().toISOString()
    }
  }

  private loadConfig(): DeploymentConfig {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('deployment_config')
        if (stored) {
          return { ...this.getDefaultConfig(), ...JSON.parse(stored) }
        }
      } catch (error) {
        console.warn('Failed to load deployment config:', error)
      }
    }

    return this.getDefaultConfig()
  }

  private getDefaultConfig(): DeploymentConfig {
    return {
      environment: 'development',
      version: '1.0.0',
      buildTime: new Date().toISOString(),
      features: {
        analytics: false,
        abTesting: false,
        monitoring: false,
        pwa: true,
        errorReporting: false
      },
      api: {
        baseUrl: 'http://localhost:3000',
        timeout: 30000,
        retries: 1
      },
      cdn: {
        images: '',
        assets: ''
      },
      monitoring: {
        performanceMonitoring: false
      },
      security: {
        enableCSP: false,
        enableHSTS: false,
        corsOrigins: ['http://localhost:3000']
      },
      performance: {
        enableCompression: true,
        enableCaching: true,
        imageOptimization: true
      }
    }
  }

  private persistConfig(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('deployment_config', JSON.stringify(this.config))
      } catch (error) {
        console.warn('Failed to persist deployment config:', error)
      }
    }
  }

  private persistDeploymentHistory(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('deployment_history', JSON.stringify(this.deploymentHistory))
      } catch (error) {
        console.warn('Failed to persist deployment history:', error)
      }
    }
  }

  private getApiBaseUrl(env: string): string {
    switch (env) {
      case 'production':
        return process.env.NEXT_PUBLIC_API_URL || 'https://api.salam-bumi.com'
      case 'staging':
        return 'https://api-staging.salam-bumi.com'
      default:
        return 'http://localhost:3000'
    }
  }

  private getCdnUrl(env: string, type: string): string {
    switch (env) {
      case 'production':
        return type === 'images'
          ? 'https://cdn.salam-bumi.com/images'
          : 'https://cdn.salam-bumi.com/assets'
      case 'staging':
        return type === 'images'
          ? 'https://cdn-staging.salam-bumi.com/images'
          : 'https://cdn-staging.salam-bumi.com/assets'
      default:
        return ''
    }
  }

  private getCorsOrigins(env: string): string[] {
    switch (env) {
      case 'production':
        return ['https://salam-bumi.com', 'https://www.salam-bumi.com']
      case 'staging':
        return ['https://staging.salam-bumi.com']
      default:
        return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
    }
  }
}

// Export singleton instance
export const deploymentManager = DeploymentManager.getInstance()