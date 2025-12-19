'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react'
import type { Property } from '@/types'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Temporarily disable marker clustering to avoid SSR issues
// const MarkerClusterGroup = dynamic(
//   () => import('react-leaflet-markercluster'),
//   { ssr: false }
// )

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  onPropertyClick?: (property: Property) => void
  selectedProperty?: Property | null
  className?: string
}

// Default coordinates for Yogyakarta area
const DEFAULT_CENTER: [number, number] = [-7.7956, 110.3695] // Yogyakarta coordinates
const DEFAULT_ZOOM = 12

// Custom marker icon
const createCustomIcon = (property: Property) => {
  const isPremium = property.isPremium
  const isHot = property.isHot
  const isFeatured = property.isFeatured

  let iconColor = '#3B82F6' // blue-500
  let iconSize: [number, number] = [25, 41]

  if (isPremium) {
    iconColor = '#F59E0B' // yellow-500
    iconSize = [30, 46]
  } else if (isHot) {
    iconColor = '#EF4444' // red-500
    iconSize = [28, 43]
  } else if (isFeatured) {
    iconColor = '#06B6D4' // cyan-500
    iconSize = [27, 42]
  }

  // Create custom icon using Leaflet's divIcon
  return {
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 2.5 0.7 4.8 2 6.8L12.5 41l10.5-21.7c1.3-2 2-4.3 2-6.8C25 5.596 19.404 0 12.5 0z" fill="${iconColor}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        ${isPremium ? '<text x="12.5" y="16" text-anchor="middle" font-size="8" fill="#000">👑</text>' : ''}
        ${isHot ? '<text x="12.5" y="16" text-anchor="middle" font-size="8" fill="#000">🔥</text>' : ''}
        ${isFeatured ? '<text x="12.5" y="16" text-anchor="middle" font-size="8" fill="#000">💎</text>' : ''}
      </svg>
    `)}`,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]]
  }
}

// Mock coordinates for properties (in real app, this would come from property data)
const getPropertyCoordinates = (property: Property): [number, number] => {
  // Generate mock coordinates around Yogyakarta based on property ID
  const baseLat = -7.7956
  const baseLng = 110.3695
  const hash = property.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const latOffset = (hash % 100 - 50) * 0.01 // ±0.5 degrees
  const lngOffset = (hash % 80 - 40) * 0.01 // ±0.4 degrees

  return [baseLat + latOffset, baseLng + lngOffset]
}

export function PropertyMap({
  properties,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '400px',
  onPropertyClick,
  selectedProperty,
  className = ''
}: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(center)
  const [mapZoom, setMapZoom] = useState(zoom)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update map center when selected property changes
  useEffect(() => {
    if (selectedProperty) {
      const coordinates = getPropertyCoordinates(selectedProperty)
      setMapCenter(coordinates)
      setMapZoom(15) // Zoom in when property is selected
    }
  }, [selectedProperty])

  if (!isClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div style={{ height }} className="relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {properties.map((property) => {
              const coordinates = getPropertyCoordinates(property)
              const isSelected = selectedProperty?.id === property.id

              return (
                <Marker
                  key={property.id}
                  position={coordinates}
                  eventHandlers={{
                    click: () => onPropertyClick?.(property)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex gap-2 mb-2">
                        {property.isPremium && <Badge className="bg-yellow-500">PREMIUM</Badge>}
                        {property.isHot && <Badge className="bg-red-500">HOT</Badge>}
                        {property.isFeatured && <Badge className="bg-cyan-500">FEATURED</Badge>}
                      </div>

                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {property.judulProperti}
                      </h3>

                      <p className="text-xs text-gray-600 mb-2">
                        {property.kodeListing}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{property.kabupaten}, {property.provinsi}</span>
                      </div>

                      <p className="font-bold text-blue-600 mb-2">
                        Rp {property.hargaProperti.toLocaleString('id-ID')}
                      </p>

                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => onPropertyClick?.(property)}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={() => {
                setMapCenter(DEFAULT_CENTER)
                setMapZoom(DEFAULT_ZOOM)
              }}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Legenda</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Properti Biasa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span>Featured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Hot Deal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Premium</span>
              </div>
            </div>
          </div>

          {/* Property Count */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <span className="text-sm font-medium">
              {properties.length} Properti
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}