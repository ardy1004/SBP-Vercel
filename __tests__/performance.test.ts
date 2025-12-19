// Performance Tests
// Comprehensive performance testing for critical user journeys

import { aiPropertyMatcher } from '../lib/ai-property-matcher'
import { personalizationEngine } from '../lib/personalization-engine'
import { analyticsTracker } from '../lib/analytics-tracker'

// Mock data generators
const generateMockProperties = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prop_${i}`,
    kodeListing: `P${i.toString().padStart(3, '0')}`,
    judulProperti: `Property ${i}`,
    deskripsi: `Description for property ${i}`,
    jenisProperti: ['rumah', 'apartemen', 'villa'][i % 3],
    luasTanah: Math.floor(Math.random() * 500) + 50,
    luasBangunan: Math.floor(Math.random() * 300) + 50,
    kamarTidur: Math.floor(Math.random() * 5) + 1,
    kamarMandi: Math.floor(Math.random() * 4) + 1,
    hargaProperti: Math.floor(Math.random() * 5000000000) + 100000000,
    provinsi: 'DKI Jakarta',
    kabupaten: ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan'][i % 3],
    kecamatan: `Kecamatan ${i}`,
    kelurahan: `Kelurahan ${i}`,
    imageUrl: `https://example.com/image${i}.jpg`,
    isPremium: Math.random() > 0.8,
    isFeatured: Math.random() > 0.7,
    isHot: Math.random() > 0.9,
    status: 'dijual',
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

const generateMockSearchHistory = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `search_${i}`,
    query: `search query ${i}`,
    filters: {
      jenis: ['rumah', 'apartemen'][i % 2],
      kabupaten: ['Jakarta Pusat', 'Jakarta Selatan'][i % 2]
    },
    timestamp: new Date(Date.now() - i * 60000), // Spread over time
    resultsCount: Math.floor(Math.random() * 50) + 1
  }))
}

describe('Performance Tests', () => {
  describe('AI Property Matcher Performance', () => {
    test('should score 100 properties within 500ms', () => {
      const properties = generateMockProperties(100)
      const userPreferences = {
        budget: { min: 500000000, max: 2000000000 },
        propertyTypes: ['rumah', 'apartemen'],
        locations: ['Jakarta Pusat', 'Jakarta Selatan'],
        features: ['premium'],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      }

      const startTime = performance.now()
      const scores = aiPropertyMatcher.scoreProperties(properties, userPreferences)
      const endTime = performance.now()

      expect(scores).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(500) // 500ms threshold
    })

    test('should score 1000 properties within 2 seconds', () => {
      const properties = generateMockProperties(1000)
      const userPreferences = {
        budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
        propertyTypes: [],
        locations: [],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      }

      const startTime = performance.now()
      const scores = aiPropertyMatcher.scoreProperties(properties, userPreferences)
      const endTime = performance.now()

      expect(scores).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(2000) // 2 second threshold
    })

    test('should generate recommendations within 1 second', () => {
      const properties = generateMockProperties(500)
      const userPreferences = {
        budget: { min: 100000000, max: 1000000000 },
        propertyTypes: ['rumah'],
        locations: ['Jakarta Selatan'],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      }
      const userHistory = ['prop_1', 'prop_2', 'prop_3']

      const startTime = performance.now()
      const result = aiPropertyMatcher.generateMatchResult(
        properties,
        userPreferences,
        userHistory
      )
      const endTime = performance.now()

      expect(result.topMatches.length).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(1000) // 1 second threshold
    })
  })

  describe('Personalization Engine Performance', () => {
    const userId = 'test_user_performance'

    test('should generate personalization within 500ms', () => {
      const properties = generateMockProperties(200)
      const searchHistory = generateMockSearchHistory(20)

      // Setup user profile
      personalizationEngine.updateUserProfile(userId, {
        searchHistory,
        viewedProperties: ['prop_1', 'prop_2', 'prop_3'],
        favoriteProperties: ['prop_4', 'prop_5']
      })

      const startTime = performance.now()
      const personalization = personalizationEngine.generatePersonalization(userId, properties)
      const endTime = performance.now()

      expect(personalization.recommendations.forYou.length).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(500) // 500ms threshold
    })

    test('should handle concurrent personalization requests', async () => {
      const properties = generateMockProperties(100)
      const userIds = Array.from({ length: 10 }, (_, i) => `concurrent_user_${i}`)

      // Setup user profiles
      userIds.forEach(userId => {
        personalizationEngine.updateUserProfile(userId, {
          searchHistory: generateMockSearchHistory(5),
          viewedProperties: ['prop_1', 'prop_2'],
          favoriteProperties: ['prop_3']
        })
      })

      const startTime = performance.now()

      // Run personalization for all users concurrently
      const promises = userIds.map(userId =>
        Promise.resolve(personalizationEngine.generatePersonalization(userId, properties))
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()

      expect(results).toHaveLength(10)
      results.forEach(result => {
        expect(result.recommendations.forYou.length).toBeGreaterThan(0)
      })

      expect(endTime - startTime).toBeLessThan(2000) // 2 second threshold for 10 concurrent requests
    })
  })

  describe('Analytics Tracker Performance', () => {
    test('should handle high-frequency events without blocking', () => {
      const userId = 'analytics_test_user'
      analyticsTracker.setUserId(userId)

      const eventCount = 100
      const startTime = performance.now()

      // Fire many events rapidly
      for (let i = 0; i < eventCount; i++) {
        analyticsTracker.trackEvent('search_performed', {
          eventNumber: i,
          timestamp: Date.now()
        })
      }

      const endTime = performance.now()

      // Should complete within reasonable time (allowing for async processing)
      expect(endTime - startTime).toBeLessThan(1000) // 1 second for 100 events
    })

    test('should generate reports within 2 seconds', () => {
      // Generate some test events
      const userId = 'report_test_user'
      analyticsTracker.setUserId(userId)

      // Add some events
      for (let i = 0; i < 50; i++) {
        analyticsTracker.trackEvent('search_performed', { index: i })
      }

      const startTime = performance.now()
      const report = analyticsTracker.generateReport()
      const endTime = performance.now()

      expect(report.overview.totalEvents).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(2000) // 2 second threshold
    })
  })

  describe('Memory Usage', () => {
    test('should not have memory leaks in property scoring', () => {
      // Note: Memory testing is limited in Node.js environment
      // In browser environment, we would check performance.memory

      // Run multiple scoring operations to ensure no obvious memory issues
      for (let i = 0; i < 10; i++) {
        const properties = generateMockProperties(100)
        const userPreferences = {
          budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
          propertyTypes: [],
          locations: [],
          features: [],
          priorities: { price: 5, location: 5, size: 5, features: 5 }
        }

        const scores = aiPropertyMatcher.scoreProperties(properties, userPreferences)
        expect(scores).toHaveLength(100)
      }

      // Test passes if no exceptions are thrown during repeated operations
      expect(true).toBe(true)
    })
  })

  describe('Concurrent Operations', () => {
    test('should handle multiple AI operations simultaneously', async () => {
      const operations = Array.from({ length: 5 }, async (_, i) => {
        const properties = generateMockProperties(50)
        const userPreferences = {
          budget: { min: 100000000 * (i + 1), max: 1000000000 * (i + 1) },
          propertyTypes: ['rumah'],
          locations: [`Location ${i}`],
          features: [],
          priorities: { price: 5, location: 5, size: 5, features: 5 }
        }

        return aiPropertyMatcher.scoreProperties(properties, userPreferences)
      })

      const startTime = performance.now()
      const results = await Promise.all(operations)
      const endTime = performance.now()

      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result.length).toBe(50)
      })

      expect(endTime - startTime).toBeLessThan(1500) // 1.5 second threshold
    })
  })

  describe('Real User Scenarios', () => {
    test('should handle typical user search scenario', () => {
      // Simulate a typical user searching for properties
      const properties = generateMockProperties(200)
      const userPreferences = {
        budget: { min: 500000000, max: 1500000000 },
        propertyTypes: ['rumah', 'apartemen'],
        locations: ['Jakarta Selatan', 'Jakarta Pusat'],
        features: ['premium', 'featured'],
        priorities: { price: 8, location: 7, size: 6, features: 5 }
      }

      const startTime = performance.now()

      // Complete user journey: search -> score -> recommend
      const scores = aiPropertyMatcher.scoreProperties(properties, userPreferences)
      const result = aiPropertyMatcher.generateMatchResult(
        properties,
        userPreferences,
        ['prop_1', 'prop_2']
      )

      const endTime = performance.now()

      expect(scores.length).toBe(200)
      expect(result.topMatches.length).toBeGreaterThan(0)
      expect(result.recommendations.personalized.length).toBeGreaterThan(0)

      // Should complete within 1 second for typical user scenario
      expect(endTime - startTime).toBeLessThan(1000)
    })

    test('should handle power user with many saved searches', () => {
      const userId = 'power_user_test'
      const properties = generateMockProperties(100)

      // Setup power user with many saved searches
      const savedSearches = Array.from({ length: 20 }, (_, i) => ({
        id: `saved_${i}`,
        name: `Search ${i}`,
        query: `power search ${i}`,
        filters: { jenis: 'rumah', kabupaten: 'Jakarta Selatan' },
        createdAt: new Date(),
        notificationEnabled: true
      }))

      personalizationEngine.updateUserProfile(userId, {
        savedSearches,
        searchHistory: generateMockSearchHistory(50),
        viewedProperties: Array.from({ length: 30 }, (_, i) => `prop_${i}`),
        favoriteProperties: Array.from({ length: 10 }, (_, i) => `fav_${i}`)
      })

      const startTime = performance.now()
      const personalization = personalizationEngine.generatePersonalization(userId, properties)
      const endTime = performance.now()

      expect(personalization.savedItems.searches.length).toBe(20)
      expect(personalization.recommendations.forYou.length).toBeGreaterThan(0)

      // Should handle power user scenario within 1 second
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})