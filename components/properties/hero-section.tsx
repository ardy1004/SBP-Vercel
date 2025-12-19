'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, TrendingUp, Star, ChevronDown } from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  onSearch?: (query: string) => void
  stats?: {
    totalProperties: number
    newThisMonth: number
    avgPrice: number
    topLocation: string
  }
}

const defaultStats = {
  totalProperties: 12450,
  newThisMonth: 320,
  avgPrice: 850000000,
  topLocation: 'Yogyakarta'
}

export function HeroSection({ onSearch, stats = defaultStats }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Hero background images/videos
  const heroSlides = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
      title: 'Temukan Rumah Impian Anda',
      subtitle: 'Koleksi properti premium di Yogyakarta'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
      title: 'Investasi Properti Terbaik',
      subtitle: 'Lokasi strategis dengan potensi tinggi'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
      title: 'Hunian Modern & Nyaman',
      subtitle: 'Desain arsitektur terkini'
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide].src})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <motion.h1
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {heroSlides[currentSlide].title.split(' ').map((word, index) => (
              <span key={index} className="inline-block">
                {word === 'Impian' || word === 'Terbaik' || word === 'Modern' ? (
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  word
                )}
                {index < heroSlides[currentSlide].title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className={`bg-white rounded-2xl shadow-2xl p-2 transition-all duration-300 ${
              isSearchFocused ? 'ring-4 ring-blue-500/20 shadow-3xl' : ''
            }`}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari properti, lokasi, atau fitur... (contoh: rumah 2 lantai di sleman)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                  />
                </div>
                <EnhancedButton
                  size="lg"
                  className="px-8 py-4 rounded-xl"
                  onClick={handleSearch}
                  variant="gradient"
                  icon={<Search className="w-5 h-5" />}
                >
                  Cari
                </EnhancedButton>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="flex flex-wrap justify-center gap-2 mt-4"
            >
              {[
                { label: 'Dijual', icon: '🏠' },
                { label: 'Disewakan', icon: '🏢' },
                { label: 'Premium', icon: '👑' },
                { label: 'Baru', icon: '✨' },
                { label: 'Murah', icon: '💰' },
                { label: 'Strategis', icon: '📍' }
              ].map((filter, index) => (
                <motion.button
                  key={filter.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                label: 'Properti',
                value: stats.totalProperties.toLocaleString(),
                icon: '🏠',
                trend: '+12%'
              },
              {
                label: 'Baru Bulan Ini',
                value: stats.newThisMonth.toString(),
                icon: '✨',
                trend: '+8%'
              },
              {
                label: 'Rata-rata Harga',
                value: `Rp ${(stats.avgPrice / 1000000000).toFixed(1)}M`,
                icon: '💰',
                trend: '+5%'
              },
              {
                label: 'Lokasi Teratas',
                value: stats.topLocation,
                icon: '📍',
                trend: 'Hot'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-wide mb-1">
                  {stat.label}
                </div>
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-200 border-green-400/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center cursor-pointer hover:border-white/80 transition-colors"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-3"
          />
        </motion.div>
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-30 md:hidden"
      >
        <EnhancedButton
          size="lg"
          shape="circle"
          variant="gradient"
          className="shadow-2xl"
          onClick={() => setIsSearchFocused(true)}
        >
          <Search className="w-6 h-6" />
        </EnhancedButton>
      </motion.div>
    </div>
  )
}