'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Share2,
  MapPin,
  Maximize,
  Bed,
  Bath,
  Car,
  TrendingUp,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  MessageCircle
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Badge } from '@/components/ui/badge'
import { formatPriceNew } from '@/lib/utils'
import type { Property } from '@/types'

interface EnhancedPropertyCardProps {
  property: Property
  variant?: 'grid' | 'list' | 'featured'
  showAgent?: boolean
  priority?: 'high' | 'normal'
  className?: string
}

export function EnhancedPropertyCard({
  property,
  variant = 'grid',
  showAgent = true,
  priority = 'normal',
  className
}: EnhancedPropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isCompared, setIsCompared] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const images = [
    property.imageUrl,
    property.imageUrl1,
    property.imageUrl2,
    property.imageUrl3,
    property.imageUrl4,
    property.imageUrl5,
    property.imageUrl6,
    property.imageUrl7,
    property.imageUrl8,
    property.imageUrl9
  ].filter(Boolean)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getPropertyTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      rumah: '🏠',
      kost: '🏢',
      apartment: '🏙️',
      villa: '🏖️',
      gudang: '📦',
      ruko: '🏪',
      tanah: '🌱',
      bangunan_komersial: '🏢',
      hotel: '🏨'
    }
    return icons[type] || '🏠'
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      rumah: 'Rumah',
      kost: 'Kost',
      apartment: 'Apartemen',
      villa: 'Villa',
      gudang: 'Gudang',
      ruko: 'Ruko',
      tanah: 'Tanah',
      bangunan_komersial: 'Komersial',
      hotel: 'Hotel'
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')
  }

  const getLocationDisplay = () => {
    const parts = []
    if (property.kelurahan) parts.push(property.kelurahan)
    if (property.kecamatan) parts.push(property.kecamatan)
    if (property.kabupaten) parts.push(property.kabupaten.charAt(0).toUpperCase() + property.kabupaten.slice(1))
    if (property.provinsi) parts.push(property.provinsi.charAt(0).toUpperCase() + property.provinsi.slice(1))
    return parts.join(', ')
  }

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
      >
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-80 h-48 flex-shrink-0">
            <Image
              src={images[currentImageIndex] || '/placeholder-property.jpg'}
              alt={property.judulProperti || ''}
              fill
              className="object-cover"
              priority={priority === 'high'}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {property.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg">
                  👑 Premium
                </Badge>
              )}
              {property.isHot && (
                <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white border-0 shadow-lg">
                  🔥 Hot Deal
                </Badge>
              )}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge className={`text-white border-0 shadow-lg ${
                property.status === 'dijual'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}>
                {property.status === 'dijual' ? 'DIJUAL' : 'DISEWA'}
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorited(!isFavorited)
                }}
                className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                  isFavorited
                    ? 'bg-red-500 text-white border-red-500 shadow-lg'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-md'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsCompared(!isCompared)
                }}
                className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                  isCompared
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-md'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Link href={`/properties/${property.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {property.judulProperti}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">{property.kodeListing}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPriceNew(property.hargaProperti)}
                </div>
                {property.hargaPerMeter && (
                  <div className="text-sm text-gray-500">
                    {formatPriceNew(property.hargaProperti / (property.luasTanah || 1), { isPerMeter: true })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{getLocationDisplay()}</span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              {property.luasTanah && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{property.luasTanah}</div>
                  <div className="text-xs text-gray-500">LT (m²)</div>
                </div>
              )}
              {property.luasBangunan && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{property.luasBangunan}</div>
                  <div className="text-xs text-gray-500">LB (m²)</div>
                </div>
              )}
              {property.kamarTidur && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{property.kamarTidur}</div>
                  <div className="text-xs text-gray-500">KT</div>
                </div>
              )}
              {property.kamarMandi && (
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{property.kamarMandi}</div>
                  <div className="text-xs text-gray-500">KM</div>
                </div>
              )}
            </div>

            {showAgent && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {property.ownerContact?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Agen Properti</div>
                    <div className="text-xs text-gray-500">Tersedia segera</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <EnhancedButton size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Hubungi
                  </EnhancedButton>
                  <EnhancedButton size="sm" variant="gradient">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </EnhancedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`group ${className}`}
    >
      <EnhancedCard variant="default" hover="lift" animation="fadeIn">
        {/* Image Section with Enhanced Gallery */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={images[currentImageIndex] || '/placeholder-property.jpg'}
            alt={property.judulProperti || ''}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority={priority === 'high'}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Image Navigation Overlay */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Enhanced Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {property.isPremium && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              >
                👑 Premium
              </motion.div>
            )}
            {property.isHot && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-red-400 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              >
                🔥 Hot Deal
              </motion.div>
            )}
            {property.isFeatured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              >
                💎 Featured
              </motion.div>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`text-white border-0 shadow-lg ${
              property.status === 'dijual'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}>
              {property.status === 'dijual' ? 'DIJUAL' : 'DISEWA'}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-full group-hover:translate-x-0 transition-transform duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                isFavorited
                  ? 'bg-red-500 text-white border-red-500 shadow-lg'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-md'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                setIsCompared(!isCompared)
              }}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                isCompared
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-md'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? 'bg-white shadow-lg'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Property Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 shadow-md">
              <span className="mr-1">{getPropertyTypeIcon(property.jenisProperti)}</span>
              {getPropertyTypeLabel(property.jenisProperti)}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <Link href={`/properties/${property.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {property.judulProperti}
            </h3>
          </Link>

          <p className="text-sm text-gray-500 mb-2">{property.kodeListing}</p>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{getLocationDisplay()}</span>
          </div>

          <div className="mb-3">
            <div className="text-xl font-bold text-blue-600">
              {formatPriceNew(property.hargaProperti)}
            </div>
            {property.hargaPerMeter && (
              <div className="text-sm text-gray-500">
                {formatPriceNew(property.hargaProperti / (property.luasTanah || 1), { isPerMeter: true })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {property.luasTanah && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{property.luasTanah}</div>
                <div className="text-xs text-gray-500">LT</div>
              </div>
            )}
            {property.luasBangunan && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{property.luasBangunan}</div>
                <div className="text-xs text-gray-500">LB</div>
              </div>
            )}
            {property.kamarTidur && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{property.kamarTidur}</div>
                <div className="text-xs text-gray-500">KT</div>
              </div>
            )}
            {property.kamarMandi && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{property.kamarMandi}</div>
                <div className="text-xs text-gray-500">KM</div>
              </div>
            )}
          </div>

          {showAgent && (
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {property.ownerContact?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Agen Properti</div>
                <div className="text-xs text-gray-500">Tersedia segera</div>
              </div>
              <EnhancedButton size="sm" variant="outline" className="text-xs">
                Hubungi
              </EnhancedButton>
            </div>
          )}
        </div>
      </EnhancedCard>
    </motion.div>
  )
}