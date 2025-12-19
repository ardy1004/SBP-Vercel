// AI Property Matching Engine
// Advanced algorithm for property recommendations based on user behavior and preferences

export interface UserPreferences {
  budget: {
    min: number
    max: number
  }
  propertyTypes: string[]
  locations: string[]
  features: string[]
  priorities: {
    price: number // 1-10
    location: number // 1-10
    size: number // 1-10
    features: number // 1-10
  }
}

export interface PropertyScore {
  propertyId: string
  totalScore: number
  breakdown: {
    priceMatch: number
    locationMatch: number
    typeMatch: number
    featureMatch: number
    popularityBonus: number
  }
  confidence: number // 0-1
  reasons: string[]
}

export interface AIMatchResult {
  topMatches: PropertyScore[]
  recommendations: {
    similar: string[]
    trending: string[]
    personalized: string[]
  }
  insights: {
    averagePrice: number
    popularLocations: string[]
    trendingFeatures: string[]
  }
}

export class AIPropertyMatcher {
  private static instance: AIPropertyMatcher

  public static getInstance(): AIPropertyMatcher {
    if (!AIPropertyMatcher.instance) {
      AIPropertyMatcher.instance = new AIPropertyMatcher()
    }
    return AIPropertyMatcher.instance
  }

  /**
   * Analyze user search behavior and create preference profile
   */
  analyzeUserBehavior(searchHistory: any[], viewedProperties: any[], savedProperties: any[]): UserPreferences {
    const preferences: UserPreferences = {
      budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
      propertyTypes: [],
      locations: [],
      features: [],
      priorities: {
        price: 5,
        location: 5,
        size: 5,
        features: 5
      }
    }

    // Analyze search history
    searchHistory.forEach(search => {
      if (search.budget) {
        preferences.budget.min = Math.min(preferences.budget.min, search.budget.min || 0)
        preferences.budget.max = Math.max(preferences.budget.max, search.budget.max || Number.MAX_SAFE_INTEGER)
      }

      if (search.propertyType) {
        if (!preferences.propertyTypes.includes(search.propertyType)) {
          preferences.propertyTypes.push(search.propertyType)
        }
      }

      if (search.location) {
        if (!preferences.locations.includes(search.location)) {
          preferences.locations.push(search.location)
        }
      }
    })

    // Analyze viewed properties
    const priceRange = viewedProperties.map(p => p.hargaProperti).filter(Boolean)
    if (priceRange.length > 0) {
      const avgPrice = priceRange.reduce((a, b) => a + b, 0) / priceRange.length
      const stdDev = Math.sqrt(
        priceRange.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / priceRange.length
      )

      preferences.budget.min = Math.max(preferences.budget.min, avgPrice - stdDev)
      preferences.budget.max = Math.min(preferences.budget.max, avgPrice + stdDev)
    }

    // Extract common features from saved/viewed properties
    const allFeatures = viewedProperties.concat(savedProperties)
      .flatMap(p => this.extractPropertyFeatures(p))

    const featureCounts: Record<string, number> = {}
    allFeatures.forEach(feature => {
      featureCounts[feature] = (featureCounts[feature] || 0) + 1
    })

    preferences.features = Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature)

    return preferences
  }

  /**
   * Score properties based on user preferences
   */
  scoreProperties(properties: any[], preferences: UserPreferences): PropertyScore[] {
    return properties.map(property => {
      const score = this.calculatePropertyScore(property, preferences)
      return {
        propertyId: property.id,
        totalScore: score.total,
        breakdown: score.breakdown,
        confidence: score.confidence,
        reasons: score.reasons
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }

  /**
   * Generate comprehensive match result
   */
  generateMatchResult(
    allProperties: any[],
    userPreferences: UserPreferences,
    userHistory: any[]
  ): AIMatchResult {
    const scoredProperties = this.scoreProperties(allProperties, userPreferences)
    const topMatches = scoredProperties.slice(0, 10)

    // Generate recommendations
    const recommendations = {
      similar: this.findSimilarProperties(topMatches[0]?.propertyId, allProperties, userHistory),
      trending: this.findTrendingProperties(allProperties),
      personalized: this.generatePersonalizedRecommendations(userPreferences, allProperties, userHistory)
    }

    // Generate insights
    const insights = this.generateMarketInsights(allProperties, userPreferences)

    return {
      topMatches,
      recommendations,
      insights
    }
  }

  /**
   * Calculate detailed score for a single property
   */
  private calculatePropertyScore(property: any, preferences: UserPreferences): {
    total: number
    breakdown: PropertyScore['breakdown']
    confidence: number
    reasons: string[]
  } {
    const reasons: string[] = []
    let totalScore = 0
    const maxScore = 100

    // Price matching (30% weight)
    const priceScore = this.calculatePriceScore(property.hargaProperti, preferences.budget)
    totalScore += priceScore * 0.3
    if (priceScore > 80) reasons.push('Harga sangat sesuai budget')
    else if (priceScore > 60) reasons.push('Harga cukup sesuai budget')

    // Location matching (25% weight)
    const locationScore = this.calculateLocationScore(property, preferences.locations)
    totalScore += locationScore * 0.25
    if (locationScore > 80) reasons.push('Lokasi sangat sesuai preferensi')
    else if (locationScore > 60) reasons.push('Lokasi strategis')

    // Property type matching (20% weight)
    const typeScore = this.calculateTypeScore(property.jenisProperti, preferences.propertyTypes)
    totalScore += typeScore * 0.2
    if (typeScore > 90) reasons.push('Tipe properti sesuai preferensi')

    // Features matching (15% weight)
    const featureScore = this.calculateFeatureScore(property, preferences.features)
    totalScore += featureScore * 0.15
    if (featureScore > 70) reasons.push('Fasilitas sesuai kebutuhan')

    // Popularity bonus (10% weight)
    const popularityScore = this.calculatePopularityScore(property)
    totalScore += popularityScore * 0.1
    if (popularityScore > 80) reasons.push('Properti populer dan diminati')

    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidence(property, preferences)

    return {
      total: Math.min(totalScore, maxScore),
      breakdown: {
        priceMatch: priceScore,
        locationMatch: locationScore,
        typeMatch: typeScore,
        featureMatch: featureScore,
        popularityBonus: popularityScore
      },
      confidence,
      reasons: reasons.length > 0 ? reasons : ['Properti menarik untuk dilihat']
    }
  }

  private calculatePriceScore(price: number, budget: UserPreferences['budget']): number {
    if (price >= budget.min && price <= budget.max) return 100
    if (price < budget.min) return Math.max(0, 100 - ((budget.min - price) / budget.min) * 50)
    return Math.max(0, 100 - ((price - budget.max) / budget.max) * 50)
  }

  private calculateLocationScore(property: any, preferredLocations: string[]): number {
    const propertyLocation = `${property.kabupaten}, ${property.provinsi}`.toLowerCase()
    const matches = preferredLocations.filter(loc =>
      propertyLocation.includes(loc.toLowerCase()) ||
      loc.toLowerCase().includes(propertyLocation)
    )
    return matches.length > 0 ? 100 : 30 // Base score for any location
  }

  private calculateTypeScore(propertyType: string, preferredTypes: string[]): number {
    return preferredTypes.includes(propertyType) ? 100 : 20
  }

  private calculateFeatureScore(property: any, preferredFeatures: string[]): number {
    const propertyFeatures = this.extractPropertyFeatures(property)
    const matches = propertyFeatures.filter(feature =>
      preferredFeatures.some(pref => feature.toLowerCase().includes(pref.toLowerCase()))
    )
    return (matches.length / Math.max(preferredFeatures.length, 1)) * 100
  }

  private calculatePopularityScore(property: any): number {
    // Simple popularity score based on property attributes
    let score = 50 // Base score

    if (property.isPremium) score += 20
    if (property.isHot) score += 15
    if (property.isFeatured) score += 10
    if (property.imageUrl) score += 5 // Has images

    return Math.min(score, 100)
  }

  private calculateConfidence(property: any, preferences: UserPreferences): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence based on data completeness
    if (property.hargaProperti) confidence += 0.1
    if (property.jenisProperti) confidence += 0.1
    if (property.kabupaten && property.provinsi) confidence += 0.1
    if (property.imageUrl) confidence += 0.1
    if (preferences.propertyTypes.length > 0) confidence += 0.1
    if (preferences.locations.length > 0) confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  private extractPropertyFeatures(property: any): string[] {
    const features: string[] = []

    // Size-related features
    if (property.luasTanah > 200) features.push('tanah luas')
    if (property.luasBangunan > 150) features.push('bangunan luas')

    // Room features
    if (property.kamarTidur >= 3) features.push('kamar tidur banyak')
    if (property.kamarMandi >= 2) features.push('kamar mandi banyak')

    // Type-specific features
    if (property.jenisProperti === 'rumah') features.push('rumah', 'hunian')
    if (property.jenisProperti === 'apartemen') features.push('apartemen', 'modern')
    if (property.jenisProperti === 'kost') features.push('kost', 'murah')

    // Special features
    if (property.isPremium) features.push('premium', 'eksklusif')
    if (property.isHot) features.push('hot', 'trending')

    return features
  }

  private findSimilarProperties(propertyId: string, allProperties: any[], userHistory: any[]): string[] {
    if (!propertyId) return []

    const targetProperty = allProperties.find(p => p.id === propertyId)
    if (!targetProperty) return []

    return allProperties
      .filter(p => p.id !== propertyId)
      .map(property => ({
        id: property.id,
        similarity: this.calculateSimilarity(targetProperty, property)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(item => item.id)
  }

  private findTrendingProperties(allProperties: any[]): string[] {
    // Simple trending algorithm based on property attributes
    return allProperties
      .filter(p => p.isHot || p.isFeatured || p.isPremium)
      .sort((a, b) => {
        const scoreA = (a.isHot ? 3 : 0) + (a.isFeatured ? 2 : 0) + (a.isPremium ? 1 : 0)
        const scoreB = (b.isHot ? 3 : 0) + (b.isFeatured ? 2 : 0) + (b.isPremium ? 1 : 0)
        return scoreB - scoreA
      })
      .slice(0, 5)
      .map(p => p.id)
  }

  private generatePersonalizedRecommendations(
    preferences: UserPreferences,
    allProperties: any[],
    userHistory: any[]
  ): string[] {
    // Exclude already viewed/saved properties
    const viewedIds = new Set(userHistory.map(h => h.propertyId))
    const availableProperties = allProperties.filter(p => !viewedIds.has(p.id))

    return this.scoreProperties(availableProperties, preferences)
      .slice(0, 5)
      .map(score => score.propertyId)
  }

  private generateMarketInsights(allProperties: any[], userPreferences: UserPreferences) {
    const prices = allProperties.map(p => p.hargaProperti).filter(Boolean)
    const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0

    const locationCounts: Record<string, number> = {}
    allProperties.forEach(p => {
      const location = `${p.kabupaten}, ${p.provinsi}`
      locationCounts[location] = (locationCounts[location] || 0) + 1
    })

    const popularLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([location]) => location)

    // Simple trending features analysis
    const trendingFeatures = ['kolam renang', 'garasi', 'taman', 'security', 'lift']

    return {
      averagePrice,
      popularLocations,
      trendingFeatures
    }
  }

  private calculateSimilarity(prop1: any, prop2: any): number {
    let similarity = 0

    // Price similarity (30%)
    const priceDiff = Math.abs(prop1.hargaProperti - prop2.hargaProperti)
    const avgPrice = (prop1.hargaProperti + prop2.hargaProperti) / 2
    const priceSimilarity = Math.max(0, 1 - (priceDiff / avgPrice))
    similarity += priceSimilarity * 0.3

    // Location similarity (25%)
    const location1 = `${prop1.kabupaten} ${prop1.provinsi}`.toLowerCase()
    const location2 = `${prop2.kabupaten} ${prop2.provinsi}`.toLowerCase()
    const locationSimilarity = location1 === location2 ? 1 : 0.2
    similarity += locationSimilarity * 0.25

    // Type similarity (20%)
    const typeSimilarity = prop1.jenisProperti === prop2.jenisProperti ? 1 : 0
    similarity += typeSimilarity * 0.2

    // Size similarity (15%)
    const size1 = (prop1.luasTanah || 0) + (prop1.luasBangunan || 0)
    const size2 = (prop2.luasTanah || 0) + (prop2.luasBangunan || 0)
    const sizeSimilarity = size1 && size2 ? Math.max(0, 1 - Math.abs(size1 - size2) / Math.max(size1, size2)) : 0
    similarity += sizeSimilarity * 0.15

    // Feature similarity (10%)
    const features1 = this.extractPropertyFeatures(prop1)
    const features2 = this.extractPropertyFeatures(prop2)
    const commonFeatures = features1.filter(f => features2.includes(f)).length
    const featureSimilarity = commonFeatures / Math.max(features1.length, features2.length, 1)
    similarity += featureSimilarity * 0.1

    return similarity
  }
}

// Export singleton instance
export const aiPropertyMatcher = AIPropertyMatcher.getInstance()