// A/B Testing Framework
// Data-driven optimization for user experience and conversion

export interface Experiment {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ExperimentVariant[]
  targetAudience: TargetAudience
  goals: ExperimentGoal[]
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExperimentVariant {
  id: string
  name: string
  description: string
  trafficPercentage: number
  config: Record<string, any>
  isControl: boolean
}

export interface TargetAudience {
  userSegments: string[]
  geographicRegions: string[]
  deviceTypes: ('desktop' | 'mobile' | 'tablet')[]
  newVsReturning: 'all' | 'new' | 'returning'
  customRules?: {
    key: string
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
    value: any
  }[]
}

export interface ExperimentGoal {
  id: string
  name: string
  type: 'conversion' | 'engagement' | 'revenue'
  eventName: string
  targetValue?: number
  isPrimary: boolean
}

export interface ExperimentResult {
  experimentId: string
  variantId: string
  metrics: {
    participants: number
    conversions: number
    conversionRate: number
    averageOrderValue?: number
    sessionDuration: number
    bounceRate: number
    goalCompletions: Record<string, number>
  }
  confidence: number
  statisticalSignificance: boolean
  winner: boolean
}

export interface UserVariant {
  userId: string
  experimentId: string
  variantId: string
  assignedAt: Date
  sessionId: string
}

export class ABTestingFramework {
  private static instance: ABTestingFramework
  private experiments: Map<string, Experiment> = new Map()
  private userVariants: Map<string, UserVariant[]> = new Map()
  private results: Map<string, ExperimentResult[]> = new Map()

  public static getInstance(): ABTestingFramework {
    if (!ABTestingFramework.instance) {
      ABTestingFramework.instance = new ABTestingFramework()
    }
    return ABTestingFramework.instance
  }

  /**
   * Create a new experiment
   */
  createExperiment(experiment: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>): Experiment {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newExperiment: Experiment = {
      ...experiment,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.experiments.set(id, newExperiment)
    this.persistExperiment(newExperiment)

    return newExperiment
  }

  /**
   * Start an experiment
   */
  startExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'draft') return false

    // Validate experiment setup
    if (!this.validateExperiment(experiment)) return false

    experiment.status = 'running'
    experiment.startDate = new Date()
    experiment.updatedAt = new Date()

    this.persistExperiment(experiment)
    return true
  }

  /**
   * Stop an experiment
   */
  stopExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') return false

    experiment.status = 'completed'
    experiment.endDate = new Date()
    experiment.updatedAt = new Date()

    this.persistExperiment(experiment)

    // Calculate final results
    this.calculateExperimentResults(experimentId)

    return true
  }

  /**
   * Assign user to experiment variant
   */
  assignUserToVariant(userId: string, experimentId: string, sessionId: string): ExperimentVariant | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') return null

    // Check if user is already assigned
    const userAssignments = this.userVariants.get(userId) || []
    const existingAssignment = userAssignments.find(a => a.experimentId === experimentId)

    if (existingAssignment) {
      const variant = experiment.variants.find(v => v.id === existingAssignment.variantId)
      return variant || null
    }

    // Check if user matches target audience
    if (!this.userMatchesAudience(userId, experiment.targetAudience)) {
      return null
    }

    // Assign variant based on traffic distribution
    const variant = this.selectVariant(experiment.variants)

    if (variant) {
      const assignment: UserVariant = {
        userId,
        experimentId,
        variantId: variant.id,
        assignedAt: new Date(),
        sessionId
      }

      userAssignments.push(assignment)
      this.userVariants.set(userId, userAssignments)
      this.persistUserAssignment(assignment)
    }

    return variant
  }

  /**
   * Get variant for user
   */
  getUserVariant(userId: string, experimentId: string): ExperimentVariant | null {
    const userAssignments = this.userVariants.get(userId) || []
    const assignment = userAssignments.find(a => a.experimentId === experimentId)

    if (!assignment) return null

    const experiment = this.experiments.get(experimentId)
    if (!experiment) return null

    return experiment.variants.find(v => v.id === assignment.variantId) || null
  }

  /**
   * Track goal completion
   */
  trackGoalCompletion(
    userId: string,
    experimentId: string,
    goalId: string,
    value?: number
  ): void {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') return

    const userAssignments = this.userVariants.get(userId) || []
    const assignment = userAssignments.find(a => a.experimentId === experimentId)

    if (!assignment) return

    // Record goal completion (in production, this would be stored in database)
    const goalKey = `${experimentId}_${assignment.variantId}_${goalId}`
    const currentValue = parseInt(localStorage.getItem(`goal_${goalKey}`) || '0')
    localStorage.setItem(`goal_${goalKey}`, (currentValue + (value || 1)).toString())
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId: string): ExperimentResult[] | null {
    return this.results.get(experimentId) || null
  }

  /**
   * Get all active experiments
   */
  getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values())
      .filter(exp => exp.status === 'running')
  }

  /**
   * Get experiment by ID
   */
  getExperiment(experimentId: string): Experiment | null {
    return this.experiments.get(experimentId) || null
  }

  /**
   * Update experiment
   */
  updateExperiment(experimentId: string, updates: Partial<Experiment>): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return false

    Object.assign(experiment, updates)
    experiment.updatedAt = new Date()

    this.persistExperiment(experiment)
    return true
  }

  /**
   * Delete experiment
   */
  deleteExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status === 'running') return false

    this.experiments.delete(experimentId)
    this.results.delete(experimentId)

    // Clean up user assignments
    this.userVariants.forEach((assignments, userId) => {
      const filtered = assignments.filter(a => a.experimentId !== experimentId)
      if (filtered.length === 0) {
        this.userVariants.delete(userId)
      } else {
        this.userVariants.set(userId, filtered)
      }
    })

    this.removePersistedExperiment(experimentId)
    return true
  }

  /**
   * Export experiment data
   */
  exportExperimentData(experimentId: string): any {
    const experiment = this.experiments.get(experimentId)
    const results = this.results.get(experimentId) || []
    const userAssignments = Array.from(this.userVariants.values())
      .flat()
      .filter(a => a.experimentId === experimentId)

    return {
      experiment,
      results,
      userAssignments,
      exportedAt: new Date().toISOString()
    }
  }

  private validateExperiment(experiment: Experiment): boolean {
    // Check traffic distribution
    const totalTraffic = experiment.variants.reduce((sum, v) => sum + v.trafficPercentage, 0)
    if (Math.abs(totalTraffic - 100) > 0.1) return false

    // Check for control variant
    const controlVariants = experiment.variants.filter(v => v.isControl)
    if (controlVariants.length !== 1) return false

    // Check goals
    if (experiment.goals.length === 0) return false
    if (experiment.goals.filter(g => g.isPrimary).length !== 1) return false

    return true
  }

  private selectVariant(variants: ExperimentVariant[]): ExperimentVariant | null {
    const random = Math.random() * 100
    let cumulative = 0

    for (const variant of variants) {
      cumulative += variant.trafficPercentage
      if (random <= cumulative) {
        return variant
      }
    }

    return null
  }

  private userMatchesAudience(userId: string, audience: TargetAudience): boolean {
    // Simplified audience matching
    // In production, this would check user profile data

    // For demo, we'll randomly assign users to experiments
    // In real implementation, check user segments, geography, etc.
    return Math.random() > 0.3 // 70% of users can participate
  }

  private calculateExperimentResults(experimentId: string): void {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return

    const results: ExperimentResult[] = []

    for (const variant of experiment.variants) {
      const variantResults = this.calculateVariantResults(experiment, variant)
      results.push(variantResults)
    }

    // Determine winner based on primary goal
    const primaryGoal = experiment.goals.find(g => g.isPrimary)
    if (primaryGoal) {
      const sortedResults = results.sort((a, b) => {
        const aMetric = a.metrics.goalCompletions[primaryGoal.id] || 0
        const bMetric = b.metrics.goalCompletions[primaryGoal.id] || 0
        return bMetric - aMetric
      })

      if (sortedResults.length > 1) {
        sortedResults[0].winner = true
      }
    }

    this.results.set(experimentId, results)
  }

  private calculateVariantResults(experiment: Experiment, variant: ExperimentVariant): ExperimentResult {
    // Simplified result calculation
    // In production, this would analyze real user data

    const participants = Math.floor(Math.random() * 1000) + 100
    const conversions = Math.floor(participants * (Math.random() * 0.1 + 0.02)) // 2-12% conversion
    const conversionRate = (conversions / participants) * 100

    const goalCompletions: Record<string, number> = {}
    experiment.goals.forEach(goal => {
      goalCompletions[goal.id] = Math.floor(conversions * (Math.random() * 0.5 + 0.5))
    })

    return {
      experimentId: experiment.id,
      variantId: variant.id,
      metrics: {
        participants,
        conversions,
        conversionRate,
        sessionDuration: Math.random() * 300 + 120, // 2-7 minutes
        bounceRate: Math.random() * 30 + 40, // 40-70%
        goalCompletions
      },
      confidence: Math.random() * 30 + 70, // 70-100%
      statisticalSignificance: Math.random() > 0.1, // 90% significance
      winner: false
    }
  }

  private persistExperiment(experiment: Experiment): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`experiment_${experiment.id}`, JSON.stringify(experiment))
      } catch (error) {
        console.warn('Failed to persist experiment:', error)
      }
    }
  }

  private persistUserAssignment(assignment: UserVariant): void {
    if (typeof window !== 'undefined') {
      try {
        const key = `user_assignments_${assignment.userId}`
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        existing.push(assignment)
        localStorage.setItem(key, JSON.stringify(existing))
      } catch (error) {
        console.warn('Failed to persist user assignment:', error)
      }
    }
  }

  private removePersistedExperiment(experimentId: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`experiment_${experimentId}`)
      } catch (error) {
        console.warn('Failed to remove persisted experiment:', error)
      }
    }
  }
}

// Pre-configured experiments for the property platform
export const createDefaultExperiments = (): Experiment[] => {
  return [
    {
      id: 'search_ui_test',
      name: 'Search Interface Optimization',
      description: 'Testing different search UI layouts for better user engagement',
      status: 'draft',
      variants: [
        {
          id: 'control',
          name: 'Current Design',
          description: 'Existing search interface',
          trafficPercentage: 50,
          config: { layout: 'current' },
          isControl: true
        },
        {
          id: 'variant_a',
          name: 'Enhanced AI Suggestions',
          description: 'More prominent AI-powered suggestions',
          trafficPercentage: 25,
          config: { layout: 'ai_enhanced' },
          isControl: false
        },
        {
          id: 'variant_b',
          name: 'Compact Search',
          description: 'More compact search with filters inline',
          trafficPercentage: 25,
          config: { layout: 'compact' },
          isControl: false
        }
      ],
      targetAudience: {
        userSegments: ['all'],
        geographicRegions: [],
        deviceTypes: ['desktop', 'mobile', 'tablet'],
        newVsReturning: 'all'
      },
      goals: [
        {
          id: 'search_completion',
          name: 'Search Completion Rate',
          type: 'engagement',
          eventName: 'search_performed',
          isPrimary: true
        },
        {
          id: 'property_views',
          name: 'Property Detail Views',
          type: 'engagement',
          eventName: 'property_view',
          isPrimary: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'property_card_test',
      name: 'Property Card Design',
      description: 'Testing different property card layouts for better conversion',
      status: 'draft',
      variants: [
        {
          id: 'control',
          name: 'Grid Layout',
          description: 'Current grid layout with standard cards',
          trafficPercentage: 50,
          config: { layout: 'grid', cardStyle: 'standard' },
          isControl: true
        },
        {
          id: 'variant_a',
          name: 'Enhanced Cards',
          description: 'Cards with more visual elements and animations',
          trafficPercentage: 50,
          config: { layout: 'grid', cardStyle: 'enhanced' },
          isControl: false
        }
      ],
      targetAudience: {
        userSegments: ['property_searchers'],
        geographicRegions: [],
        deviceTypes: ['desktop', 'mobile', 'tablet'],
        newVsReturning: 'all'
      },
      goals: [
        {
          id: 'property_clicks',
          name: 'Property Card Clicks',
          type: 'engagement',
          eventName: 'property_view',
          isPrimary: true
        },
        {
          id: 'contact_initiation',
          name: 'Contact Form Submissions',
          type: 'conversion',
          eventName: 'contact_initiated',
          isPrimary: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

// Export singleton instance
export const abTestingFramework = ABTestingFramework.getInstance()