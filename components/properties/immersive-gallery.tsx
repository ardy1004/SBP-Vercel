'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import type { Property } from '@/types'

interface ImmersiveGalleryProps {
  property: Property
  className?: string
}

export function ImmersiveGallery({ property, className }: ImmersiveGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const imageRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

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

  // Auto-play functionality
  const startAutoPlay = () => {
    setIsAutoPlaying(true)
    autoPlayRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)
  }

  const stopAutoPlay = () => {
    setIsAutoPlaying(false)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    if (isZoomed) {
      setZoomLevel(1)
      setIsZoomed(false)
    } else {
      setZoomLevel(2)
      setIsZoomed(true)
    }
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
    setIsZoomed(true)
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
    setIsZoomed(false)
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setIsZoomed(false)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setZoomLevel(1)
    setIsZoomed(false)
    document.body.style.overflow = 'unset'
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            prevImage()
            break
          case 'ArrowRight':
            e.preventDefault()
            nextImage()
            break
          case 'Escape':
            e.preventDefault()
            closeFullscreen()
            break
          case '+':
          case '=':
            e.preventDefault()
            zoomIn()
            break
          case '-':
            e.preventDefault()
            zoomOut()
            break
          case '0':
            e.preventDefault()
            resetZoom()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Cleanup auto-play on unmount
  React.useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  return (
    <>
      <div className={`relative bg-black rounded-2xl overflow-hidden group ${className}`}>
        {/* Main Image Container */}
        <div
          ref={imageRef}
          className="relative aspect-[16/10] overflow-hidden cursor-zoom-in"
          onClick={toggleZoom}
        >
          <motion.div
            animate={{ scale: zoomLevel }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{
              transformOrigin: 'center center',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in'
            }}
          >
            <Image
              src={images[currentImageIndex] || '/placeholder-property.jpg'}
              alt={`${property.judulProperti} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-2">
              {property.isPremium && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                  👑 Premium Property
                </motion.div>
              )}
              {property.isHot && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                  🔥 Hot Deal
                </motion.div>
              )}
            </div>

            <div className="flex gap-2">
              {/* Zoom Controls */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  zoomIn()
                }}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  zoomOut()
                }}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ZoomOut className="w-5 h-5" />
              </motion.button>

              {/* Auto-play */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  isAutoPlaying ? stopAutoPlay() : startAutoPlay()
                }}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>

              {/* Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  openFullscreen()
                }}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="text-white">
              <div className="text-2xl font-bold mb-1">
                Rp {property.hargaProperti.toLocaleString('id-ID')}
              </div>
              <div className="text-sm opacity-90">
                {property.judulProperti}
              </div>
            </div>

            <div className="text-white text-right">
              <div className="text-lg font-semibold">
                {currentImageIndex + 1} / {images.length}
              </div>
              <div className="text-sm opacity-75">
                {property.kodeListing}
              </div>
            </div>
          </div>

          {/* Zoom Indicator */}
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm"
            >
              {Math.round(zoomLevel * 100)}%
            </motion.div>
          )}

          {/* Auto-play Indicator */}
          {isAutoPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Auto-play
            </motion.div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4"
          >
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentImageIndex(index)
                    setZoomLevel(1)
                    setIsZoomed(false)
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image || '/placeholder-property.jpg'}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 16vw, 8vw"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: zoomLevel }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-full"
                style={{
                  transformOrigin: 'center center',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                }}
                onClick={toggleZoom}
              >
                <Image
                  src={images[currentImageIndex] || '/placeholder-property.jpg'}
                  alt={`${property.judulProperti} - Fullscreen`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  quality={95}
                />
              </motion.div>

              {/* Fullscreen Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="text-white">
                  <div className="text-xl font-bold">{property.judulProperti}</div>
                  <div className="text-sm opacity-75">{property.kodeListing}</div>
                </div>

                <div className="flex gap-2">
                  <EnhancedButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      zoomIn()
                    }}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </EnhancedButton>

                  <EnhancedButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      zoomOut()
                    }}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </EnhancedButton>

                  <EnhancedButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetZoom()
                    }}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </EnhancedButton>

                  <EnhancedButton
                    variant="ghost"
                    size="sm"
                    onClick={closeFullscreen}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <Minimize className="w-4 h-4" />
                  </EnhancedButton>
                </div>
              </div>

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Zoom Level Indicator */}
              {isZoomed && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {Math.round(zoomLevel * 100)}%
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}