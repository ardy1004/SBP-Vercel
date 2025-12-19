'use client'

import { useState, useEffect, Suspense } from 'react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { AdvancedSearch } from '@/components/search/AdvancedSearch'
import { PropertyMap } from '@/components/map/PropertyMap'
import { ComparisonModal } from '@/components/comparison/ComparisonModal'
import { HeroSection } from '@/components/properties/hero-section'
import { AISearch } from '@/components/properties/ai-search'
import { EnhancedPropertyCard } from '@/components/properties/enhanced-property-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Grid3X3, List, Map, GitCompare, SlidersHorizontal, Sparkles, Heart, TrendingUp } from 'lucide-react'
import { useSearchStore } from '@/stores/searchStore'
import { useComparisonStore } from '@/stores/comparisonStore'
import { personalizationEngine } from '@/lib/personalization-engine'
import { analyticsTracker } from '@/lib/analytics-tracker'
import type { Property } from '@/types'

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-0">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [personalization, setPersonalization] = useState<any>(null)
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [total, setTotal] = useState(0)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const { query, filters, sortBy, viewMode, setViewMode } = useSearchStore()
  const { selectedProperties, isModalOpen, setModalOpen } = useComparisonStore()

  const buildSearchParams = () => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', '20')
    params.set('sort', sortBy)

    if (query) params.set('search', query)

    // Add filter parameters
    if (filters.provinsi) params.set('provinsi', filters.provinsi)
    if (filters.kabupaten) params.set('kabupaten', filters.kabupaten)
    if (filters.kecamatan) params.set('kecamatan', filters.kecamatan)
    if (filters.kelurahan) params.set('kelurahan', filters.kelurahan)

    if (filters.jenisProperti?.length) params.set('jenis', filters.jenisProperti.join(','))
    if (filters.status?.length) params.set('status', filters.status.join(','))

    if (filters.hargaMin) params.set('hargaMin', filters.hargaMin.toString())
    if (filters.hargaMax) params.set('hargaMax', filters.hargaMax.toString())

    if (filters.luasTanahMin) params.set('luasTanahMin', filters.luasTanahMin.toString())
    if (filters.luasTanahMax) params.set('luasTanahMax', filters.luasTanahMax.toString())
    if (filters.luasBangunanMin) params.set('luasBangunanMin', filters.luasBangunanMin.toString())
    if (filters.luasBangunanMax) params.set('luasBangunanMax', filters.luasBangunanMax.toString())

    if (filters.kamarTidurMin) params.set('kamarTidurMin', filters.kamarTidurMin.toString())
    if (filters.kamarMandiMin) params.set('kamarMandiMin', filters.kamarMandiMin.toString())

    if (filters.isPremium) params.set('isPremium', 'true')
    if (filters.isFeatured) params.set('isFeatured', 'true')
    if (filters.isHot) params.set('isHot', 'true')

    return params
  }

  const fetchProperties = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const params = buildSearchParams()
      params.set('page', pageNum.toString())

      const res = await fetch(`/api/properties?${params}`)
      if (!res.ok) throw new Error('Failed to fetch properties')

      const data = await res.json()
      const newProperties = data.properties || []

      if (append) {
        setProperties(prev => [...prev, ...newProperties])
      } else {
        setProperties(newProperties)
      }

      setTotal(data.pagination?.total || 0)
      setHasNextPage(data.pagination?.hasNext || false)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchProperties(1, false)
  }, [query, filters, sortBy])

  useEffect(() => {
    initializePersonalization()
  }, [])

  const initializePersonalization = async () => {
    try {
      // Set user ID for tracking
      analyticsTracker.setUserId(userId)

      // Track page view
      analyticsTracker.trackPageView('/properties')

      // Generate personalization data
      const personalizationData = personalizationEngine.generatePersonalization(userId, properties)
      setPersonalization(personalizationData)
    } catch (error) {
      console.error('Failed to initialize personalization:', error)
    }
  }

  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchProperties(page + 1, true)
    }
  }

  const handleSearch = () => {
    fetchProperties(1, false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Advanced Search - Collapsible */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <AISearch
              onSearch={handleSearch}
              placeholder="Cari properti impian Anda dengan AI..."
              className="max-w-2xl"
            />
          </div>
        </div>
      </div>

      {/* View Controls & Results Summary */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <EnhancedButton
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant={viewMode === 'map' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="h-8 w-8 p-0"
                >
                  <Map className="h-4 w-4" />
                </EnhancedButton>
              </div>

              {/* Comparison Button */}
              {selectedProperties.length > 0 && (
                <EnhancedButton
                  onClick={() => setModalOpen(true)}
                  variant="success"
                  size="sm"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Bandingkan ({selectedProperties.length})
                </EnhancedButton>
              )}

              {/* Active Filters Summary */}
              <div className="flex flex-wrap gap-2">
                {filters.jenisProperti?.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
                {filters.status?.map(status => (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <span className="text-sm text-gray-600">
              {total} properti ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Properties Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <PropertyGridSkeleton />
        ) : properties.length > 0 ? (
          <>
            {/* Properties Grid/List/Map View */}
            {viewMode === 'map' ? (
              <PropertyMap
                properties={properties}
                height="600px"
                onPropertyClick={(property) => setSelectedProperty(property)}
                selectedProperty={selectedProperty}
              />
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {properties.map((property) => (
                  <EnhancedPropertyCard
                    key={property.id}
                    property={property}
                    variant={viewMode === 'list' ? 'list' : 'grid'}
                    priority={properties.indexOf(property) < 4 ? 'high' : 'normal'}
                  />
                ))}
              </div>
            )}

            {/* Personalized Recommendations */}
            {personalization && personalization.recommendations && (
              <div className="mt-16 space-y-8">
                {/* For You Section */}
                {personalization.recommendations.forYou.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Direkomendasikan untuk Anda</h3>
                        <p className="text-gray-600">Berdasarkan preferensi dan aktivitas Anda</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {personalization.recommendations.forYou.slice(0, 4).map((propertyId: string) => {
                        const property = properties.find(p => p.id === propertyId)
                        return property ? (
                          <EnhancedPropertyCard
                            key={property.id}
                            property={property}
                            priority="high"
                          />
                        ) : null
                      }).filter(Boolean)}
                    </div>
                  </div>
                )}

                {/* Trending Properties */}
                {personalization.recommendations.trending.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Properti Trending</h3>
                        <p className="text-gray-600">Yang lagi diminati banyak orang</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {personalization.recommendations.trending.slice(0, 4).map((propertyId: string) => {
                        const property = properties.find(p => p.id === propertyId)
                        return property ? (
                          <EnhancedPropertyCard
                            key={property.id}
                            property={property}
                          />
                        ) : null
                      }).filter(Boolean)}
                    </div>
                  </div>
                )}

                {/* Saved Properties Reminder */}
                {personalization.savedItems.properties.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {personalization.savedItems.properties.length} Properti Disimpan
                          </h3>
                          <p className="text-gray-600">
                            Jangan lupa cek properti favorit Anda
                          </p>
                        </div>
                      </div>
                      <EnhancedButton variant="primary">
                        Lihat Favorit
                      </EnhancedButton>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && viewMode !== 'map' && (
              <div className="text-center mt-12">
                <EnhancedButton
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="primary"
                  size="lg"
                  className="px-8 py-3"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Muat Lebih Banyak'
                  )}
                </EnhancedButton>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada properti ditemukan
              </h3>
              <p className="text-gray-500 mb-6">
                Coba ubah kriteria pencarian atau filter untuk menemukan properti yang sesuai.
              </p>
              <EnhancedButton
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Reset Pencarian
              </EnhancedButton>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}