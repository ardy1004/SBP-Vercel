// AI Property Matcher Tests
// Comprehensive testing for AI recommendation algorithms

import { aiPropertyMatcher, UserPreferences } from '../lib/ai-property-matcher'

// Mock properties for testing
const mockProperties = [
  {
    id: 'prop1',
    judulProperti: 'Rumah Mewah Jakarta',
    hargaProperti: 2000000000,
    jenisProperti: 'rumah',
    kabupaten: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    luasTanah: 300,
    luasBangunan: 250,
    kamarTidur: 4,
    kamarMandi: 3,
    isPremium: true,
    isHot: false,
    isFeatured: true
  },
  {
    id: 'prop2',
    judulProperti: 'Apartemen Murah Bandung',
    hargaProperti: 500000000,
    jenisProperti: 'apartemen',
    kabupaten: 'Bandung',
    provinsi: 'Jawa Barat',
    luasTanah: 0,
    luasBangunan: 75,
    kamarTidur: 2,
    kamarMandi: 1,
    isPremium: false,
    isHot: true,
    isFeatured: false
  },
  {
    id: 'prop3',
    judulProperti: 'Villa Strategis Bali',
    hargaProperti: 5000000000,
    jenisProperti: 'villa',
    kabupaten: 'Badung',
    provinsi: 'Bali',
    luasTanah: 500,
    luasBangunan: 400,
    kamarTidur: 5,
    kamarMandi: 4,
    isPremium: true,
    isHot: true,
    isFeatured: true
  }
]

describe('AI Property Matcher', () => {
  describe('User Preference Analysis', () => {
    test('should analyze search history correctly', () => {
      const searchHistory = [
        {
          id: 'search1',
          query: 'rumah mewah jakarta',
          filters: { jenis: 'rumah', kabupaten: 'Jakarta Selatan' },
          timestamp: new Date(),
          resultsCount: 10
        },
        {
          id: 'search2',
          query: 'apartemen murah',
          filters: { jenis: 'apartemen', hargaMax: 1000000000 },
          timestamp: new Date(),
          resultsCount: 5
        }
      ]

      const viewedProperties = [mockProperties[0]]
      const savedProperties = [mockProperties[1]]

      const preferences = aiPropertyMatcher.analyzeUserBehavior(
        searchHistory,
        viewedProperties,
        savedProperties
      )

      expect(preferences.propertyTypes).toContain('rumah')
      expect(preferences.propertyTypes).toContain('apartemen')
      expect(preferences.locations).toContain('Jakarta Selatan')
      expect(preferences.budget.max).toBeGreaterThan(0)
    })

    test('should handle empty search history', () => {
      const preferences = aiPropertyMatcher.analyzeUserBehavior([], [], [])

      expect(preferences.propertyTypes).toEqual([])
      expect(preferences.locations).toEqual([])
      expect(preferences.budget.min).toBe(0)
      expect(preferences.budget.max).toBe(Number.MAX_SAFE_INTEGER)
    })
  })

  describe('Property Scoring', () => {
    const userPreferences: UserPreferences = {
      budget: { min: 100000000, max: 3000000000 },
      propertyTypes: ['rumah', 'apartemen'],
      locations: ['Jakarta Selatan', 'Bandung'],
      features: ['premium', 'strategis'],
      priorities: {
        price: 8,
        location: 7,
        size: 6,
        features: 5
      }
    }

    test('should score properties based on preferences', () => {
      const scores = aiPropertyMatcher.scoreProperties(mockProperties, userPreferences)

      expect(scores).toHaveLength(3)
      expect(scores[0]).toHaveProperty('propertyId')
      expect(scores[0]).toHaveProperty('totalScore')
      expect(scores[0]).toHaveProperty('breakdown')
      expect(scores[0]).toHaveProperty('confidence')
      expect(scores[0]).toHaveProperty('reasons')

      // Scores should be sorted by total score (descending)
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i].totalScore).toBeGreaterThanOrEqual(scores[i + 1].totalScore)
      }
    })

    test('should calculate price score correctly', () => {
      // Test with property within budget
      const score1 = aiPropertyMatcher.scoreProperties([mockProperties[0]], userPreferences)
      expect(score1[0].breakdown.priceMatch).toBeGreaterThan(80)

      // Test with property outside budget
      const expensivePrefs: UserPreferences = {
        ...userPreferences,
        budget: { min: 100000000, max: 1000000000 }
      }
      const score2 = aiPropertyMatcher.scoreProperties([mockProperties[2]], expensivePrefs)
      expect(score2[0].breakdown.priceMatch).toBeLessThan(50)
    })

    test('should calculate location score correctly', () => {
      const locationPrefs: UserPreferences = {
        ...userPreferences,
        locations: ['Jakarta Selatan']
      }

      const scores = aiPropertyMatcher.scoreProperties(mockProperties, locationPrefs)

      // Property in Jakarta should have higher location score
      const jakartaProperty = scores.find(s => s.propertyId === 'prop1')
      const baliProperty = scores.find(s => s.propertyId === 'prop3')

      expect(jakartaProperty?.breakdown.locationMatch).toBeGreaterThan(
        baliProperty?.breakdown.locationMatch || 0
      )
    })

    test('should calculate type score correctly', () => {
      const typePrefs: UserPreferences = {
        ...userPreferences,
        propertyTypes: ['villa']
      }

      const scores = aiPropertyMatcher.scoreProperties(mockProperties, typePrefs)

      const villaProperty = scores.find(s => s.propertyId === 'prop3')
      const rumahProperty = scores.find(s => s.propertyId === 'prop1')

      expect(villaProperty?.breakdown.typeMatch).toBe(100)
      expect(rumahProperty?.breakdown.typeMatch).toBe(0)
    })
  })

  describe('Recommendation Generation', () => {
    test('should generate comprehensive match result', () => {
      const userPreferences: UserPreferences = {
        budget: { min: 100000000, max: 2000000000 },
        propertyTypes: ['rumah'],
        locations: ['Jakarta Selatan'],
        features: [],
        priorities: {
          price: 5,
          location: 5,
          size: 5,
          features: 5
        }
      }

      const userHistory = ['prop1']
      const result = aiPropertyMatcher.generateMatchResult(
        mockProperties,
        userPreferences,
        userHistory
      )

      expect(result).toHaveProperty('topMatches')
      expect(result).toHaveProperty('recommendations')
      expect(result).toHaveProperty('insights')

      expect(result.topMatches.length).toBeGreaterThan(0)
      expect(result.recommendations).toHaveProperty('forYou')
      expect(result.recommendations).toHaveProperty('trending')
      expect(result.recommendations).toHaveProperty('similar')
      expect(result.recommendations).toHaveProperty('personalized')
    })

    test('should generate market insights', () => {
      const result = aiPropertyMatcher.generateMatchResult(
        mockProperties,
        {
          budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
          propertyTypes: [],
          locations: [],
          features: [],
          priorities: { price: 5, location: 5, size: 5, features: 5 }
        },
        []
      )

      expect(result.insights).toHaveProperty('averagePrice')
      expect(result.insights).toHaveProperty('popularLocations')
      expect(result.insights).toHaveProperty('trendingFeatures')

      expect(typeof result.insights.averagePrice).toBe('number')
      expect(Array.isArray(result.insights.popularLocations)).toBe(true)
      expect(Array.isArray(result.insights.trendingFeatures)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty property list', () => {
      const scores = aiPropertyMatcher.scoreProperties([], {
        budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
        propertyTypes: [],
        locations: [],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      })

      expect(scores).toEqual([])
    })

    test('should handle properties with missing data', () => {
      const incompleteProperty = {
        id: 'incomplete',
        judulProperti: 'Incomplete Property',
        hargaProperti: 1000000000,
        jenisProperti: 'rumah',
        // Missing location data
        kabupaten: undefined,
        provinsi: undefined
      }

      const scores = aiPropertyMatcher.scoreProperties([incompleteProperty], {
        budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
        propertyTypes: ['rumah'],
        locations: [],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      })

      expect(scores).toHaveLength(1)
      expect(scores[0].confidence).toBeLessThan(1) // Lower confidence due to missing data
    })

    test('should handle extreme budget preferences', () => {
      const extremeBudgetPrefs: UserPreferences = {
        budget: { min: 10000000000, max: Number.MAX_SAFE_INTEGER }, // Very high budget
        propertyTypes: [],
        locations: [],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      }

      const scores = aiPropertyMatcher.scoreProperties(mockProperties, extremeBudgetPrefs)

      // All properties should have low price scores
      scores.forEach(score => {
        expect(score.breakdown.priceMatch).toBeLessThan(50)
      })
    })
  })

  describe('Performance', () => {
    test('should handle large property lists efficiently', () => {
      // Create a large list of properties
      const largePropertyList = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProperties[0],
        id: `prop_${i}`,
        hargaProperti: Math.random() * 5000000000
      }))

      const startTime = Date.now()

      const scores = aiPropertyMatcher.scoreProperties(largePropertyList, {
        budget: { min: 0, max: Number.MAX_SAFE_INTEGER },
        propertyTypes: [],
        locations: [],
        features: [],
        priorities: { price: 5, location: 5, size: 5, features: 5 }
      })

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(scores).toHaveLength(1000)
      expect(executionTime).toBeLessThan(5000) // Should complete within 5 seconds
    })
  })
})