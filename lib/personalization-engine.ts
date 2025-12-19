// Personalization Engine
// Manages user preferences, saved searches, favorites, and personalized recommendations

import { aiPropertyMatcher, UserPreferences, AIMatchResult } from './ai-property-matcher'

export interface UserProfile {
  id: string
  preferences: UserPreferences
  searchHistory: SearchHistoryItem[]
  favoriteProperties: string[]
  savedSearches: SavedSearch[]
  viewedProperties: string[]
  lastActivity: Date
  deviceInfo: DeviceInfo
}

export interface SearchHistoryItem {
  id: string
  query: string
  filters: Record<string, any>
  timestamp: Date
  resultsCount: number
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: Record<string, any>
  createdAt: Date
  lastNotified?: Date
  notificationEnabled: boolean
  matchCount?: number
}

export interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  timezone: string
  screenSize: {
    width: number
    height: number
  }
}

export interface PersonalizationResult {
  recommendations: {
    forYou: string[]
    trending: string[]
    similarToViewed: string[]
    basedOnSearches: string[]
  }
  savedItems: {
    searches: SavedSearch[]
    properties: string[]
  }
  insights: {
    preferredPriceRange: { min: number; max: number }
    favoriteLocations: string[]
    commonSearchTerms: string[]
    activityPatterns: {
      peakHours: number[]
      preferredDays: number[]
    }
  }
}

export class PersonalizationEngine {
  private static instance: PersonalizationEngine
  private userProfiles: Map<string, UserProfile> = new Map()

  public static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine()
    }
    return PersonalizationEngine.instance
  }

  /**
   * Get or create user profile
   */
  getUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, this.createDefaultProfile(userId))
    }
    return this.userProfiles.get(userId)!
  }

  /**
   * Update user profile with new activity
   */
  updateUserProfile(userId: string, updates: Partial<UserProfile>): void {
    const profile = this.getUserProfile(userId)
    Object.assign(profile, updates)
    profile.lastActivity = new Date()

    // Persist to localStorage for demo (in production, use database)
    this.persistProfile(userId, profile)
  }

  /**
   * Record search activity
   */
  recordSearch(userId: string, query: string, filters: Record<string, any>, resultsCount: number): void {
    const profile = this.getUserProfile(userId)

    const searchItem: SearchHistoryItem = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      filters,
      timestamp: new Date(),
      resultsCount
    }

    profile.searchHistory.unshift(searchItem)
    profile.searchHistory = profile.searchHistory.slice(0, 50) // Keep last 50 searches

    this.updateUserProfile(userId, { searchHistory: profile.searchHistory })
  }

  /**
   * Record property view
   */
  recordPropertyView(userId: string, propertyId: string): void {
    const profile = this.getUserProfile(userId)

    // Remove if already exists, then add to front
    profile.viewedProperties = profile.viewedProperties.filter(id => id !== propertyId)
    profile.viewedProperties.unshift(propertyId)
    profile.viewedProperties = profile.viewedProperties.slice(0, 100) // Keep last 100 views

    this.updateUserProfile(userId, { viewedProperties: profile.viewedProperties })
  }

  /**
   * Toggle favorite property
   */
  toggleFavorite(userId: string, propertyId: string): boolean {
    const profile = this.getUserProfile(userId)
    const isFavorite = profile.favoriteProperties.includes(propertyId)

    if (isFavorite) {
      profile.favoriteProperties = profile.favoriteProperties.filter(id => id !== propertyId)
    } else {
      profile.favoriteProperties.unshift(propertyId)
    }

    this.updateUserProfile(userId, { favoriteProperties: profile.favoriteProperties })
    return !isFavorite
  }

  /**
   * Save a search query
   */
  saveSearch(userId: string, name: string, query: string, filters: Record<string, any>): SavedSearch {
    const profile = this.getUserProfile(userId)

    const savedSearch: SavedSearch = {
      id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      query,
      filters,
      createdAt: new Date(),
      notificationEnabled: true
    }

    profile.savedSearches.unshift(savedSearch)
    this.updateUserProfile(userId, { savedSearches: profile.savedSearches })

    return savedSearch
  }

  /**
   * Delete saved search
   */
  deleteSavedSearch(userId: string, searchId: string): boolean {
    const profile = this.getUserProfile(userId)
    const initialLength = profile.savedSearches.length

    profile.savedSearches = profile.savedSearches.filter(search => search.id !== searchId)

    if (profile.savedSearches.length !== initialLength) {
      this.updateUserProfile(userId, { savedSearches: profile.savedSearches })
      return true
    }

    return false
  }

  /**
   * Generate personalized recommendations
   */
  generatePersonalization(userId: string, allProperties: any[]): PersonalizationResult {
    const profile = this.getUserProfile(userId)

    // Analyze user preferences from behavior
    const preferences = aiPropertyMatcher.analyzeUserBehavior(
      profile.searchHistory,
      profile.viewedProperties.map(id => allProperties.find(p => p.id === id)).filter(Boolean),
      profile.favoriteProperties.map(id => allProperties.find(p => p.id === id)).filter(Boolean)
    )

    // Update profile with analyzed preferences
    this.updateUserProfile(userId, { preferences })

    // Generate AI recommendations
    const aiResult = aiPropertyMatcher.generateMatchResult(
      allProperties,
      preferences,
      profile.viewedProperties.concat(profile.favoriteProperties)
    )

    // Generate personalized insights
    const insights = this.generateInsights(profile)

    return {
      recommendations: {
        forYou: aiResult.topMatches.slice(0, 6).map(match => match.propertyId),
        trending: aiResult.recommendations.trending,
        similarToViewed: aiResult.recommendations.similar,
        basedOnSearches: aiResult.recommendations.personalized
      },
      savedItems: {
        searches: profile.savedSearches,
        properties: profile.favoriteProperties
      },
      insights
    }
  }

  /**
   * Get personalized search suggestions
   */
  getSearchSuggestions(userId: string): string[] {
    const profile = this.getUserProfile(userId)

    const suggestions: string[] = []

    // Recent searches
    const recentQueries = profile.searchHistory
      .slice(0, 3)
      .map(item => item.query)
      .filter(query => query.length > 0)

    suggestions.push(...recentQueries)

    // Popular locations from searches
    const locationPatterns = profile.searchHistory
      .flatMap(item => {
        const locations: string[] = []
        if (item.filters.location) locations.push(item.filters.location)
        if (item.filters.kabupaten) locations.push(item.filters.kabupaten)
        if (item.filters.provinsi) locations.push(item.filters.provinsi)
        return locations
      })

    const locationCounts: Record<string, number> = {}
    locationPatterns.forEach(loc => {
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    })

    const popularLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([location]) => location)

    suggestions.push(...popularLocations.map(loc => `Properti di ${loc}`))

    // Price range suggestions
    if (profile.preferences.budget.min > 0 || profile.preferences.budget.max < Number.MAX_SAFE_INTEGER) {
      const minPrice = profile.preferences.budget.min
      const maxPrice = profile.preferences.budget.max

      if (maxPrice < 500000000) {
        suggestions.push('Properti murah')
      } else if (minPrice > 1000000000) {
        suggestions.push('Properti mewah')
      }
    }

    return [...new Set(suggestions)].slice(0, 8)
  }

  /**
   * Check for new matches on saved searches
   */
  checkSavedSearchMatches(userId: string, allProperties: any[]): SavedSearch[] {
    const profile = this.getUserProfile(userId)
    const updatedSearches: SavedSearch[] = []

    profile.savedSearches.forEach(savedSearch => {
      const matches = this.findMatchingProperties(savedSearch.filters, allProperties)
      const newMatches = matches.filter(property =>
        !savedSearch.lastNotified ||
        new Date(property.created_at) > savedSearch.lastNotified
      )

      if (newMatches.length > 0) {
        savedSearch.matchCount = matches.length
        savedSearch.lastNotified = new Date()
        updatedSearches.push(savedSearch)
      }
    })

    if (updatedSearches.length > 0) {
      this.updateUserProfile(userId, { savedSearches: profile.savedSearches })
    }

    return updatedSearches
  }

  /**
   * Export user data for backup
   */
  exportUserData(userId: string): string {
    const profile = this.getUserProfile(userId)
    return JSON.stringify({
      ...profile,
      exportedAt: new Date().toISOString()
    }, null, 2)
  }

  /**
   * Import user data from backup
   */
  importUserData(userId: string, data: string): boolean {
    try {
      const importedData = JSON.parse(data)
      if (importedData.id === userId) {
        this.userProfiles.set(userId, importedData)
        this.persistProfile(userId, importedData)
        return true
      }
    } catch (error) {
      console.error('Failed to import user data:', error)
    }
    return false
  }

  private createDefaultProfile(userId: string): UserProfile {
    return {
      id: userId,
      preferences: {
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
      },
      searchHistory: [],
      favoriteProperties: [],
      savedSearches: [],
      viewedProperties: [],
      lastActivity: new Date(),
      deviceInfo: this.getDeviceInfo()
    }
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      platform: typeof window !== 'undefined' ? window.navigator.platform : '',
      language: typeof window !== 'undefined' ? window.navigator.language : 'id',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: {
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080
      }
    }
  }

  private persistProfile(userId: string, profile: UserProfile): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile))
      } catch (error) {
        console.warn('Failed to persist user profile:', error)
      }
    }
  }

  private loadProfile(userId: string): UserProfile | null {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(`user_profile_${userId}`)
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.warn('Failed to load user profile:', error)
      }
    }
    return null
  }

  private generateInsights(profile: UserProfile) {
    // Calculate preferred price range
    const prices = profile.searchHistory
      .flatMap(item => {
        const prices: number[] = []
        if (item.filters.minPrice) prices.push(item.filters.minPrice)
        if (item.filters.maxPrice) prices.push(item.filters.maxPrice)
        return prices
      })
      .filter(Boolean)

    const preferredPriceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: Number.MAX_SAFE_INTEGER }

    // Favorite locations
    const locations = profile.searchHistory
      .flatMap(item => {
        const locs: string[] = []
        if (item.filters.location) locs.push(item.filters.location)
        if (item.filters.kabupaten) locs.push(item.filters.kabupaten)
        return locs
      })
      .filter(Boolean)

    const locationCounts: Record<string, number> = {}
    locations.forEach(loc => {
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    })

    const favoriteLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([location]) => location)

    // Common search terms
    const searchTerms = profile.searchHistory
      .flatMap(item => item.query.toLowerCase().split(' '))
      .filter(word => word.length > 2)

    const termCounts: Record<string, number> = {}
    searchTerms.forEach(term => {
      termCounts[term] = (termCounts[term] || 0) + 1
    })

    const commonSearchTerms = Object.entries(termCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term)

    // Activity patterns
    const activityHours = profile.searchHistory.map(item =>
      new Date(item.timestamp).getHours()
    )

    const hourCounts: Record<number, number> = {}
    activityHours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    const activityDays = profile.searchHistory.map(item =>
      new Date(item.timestamp).getDay()
    )

    const dayCounts: Record<number, number> = {}
    activityDays.forEach(day => {
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })

    const preferredDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => parseInt(day))

    return {
      preferredPriceRange,
      favoriteLocations,
      commonSearchTerms,
      activityPatterns: {
        peakHours,
        preferredDays
      }
    }
  }

  private findMatchingProperties(filters: Record<string, any>, properties: any[]): any[] {
    return properties.filter(property => {
      // Price filter
      if (filters.minPrice && property.hargaProperti < filters.minPrice) return false
      if (filters.maxPrice && property.hargaProperti > filters.maxPrice) return false

      // Location filters
      if (filters.location && !property.alamatLengkap?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      if (filters.kabupaten && property.kabupaten !== filters.kabupaten) return false
      if (filters.provinsi && property.provinsi !== filters.provinsi) return false

      // Property type filter
      if (filters.jenis && property.jenisProperti !== filters.jenis) return false

      // Size filters
      if (filters.minLuasTanah && property.luasTanah < filters.minLuasTanah) return false
      if (filters.minLuasBangunan && property.luasBangunan < filters.minLuasBangunan) return false

      return true
    })
  }
}

// Export singleton instance
export const personalizationEngine = PersonalizationEngine.getInstance()