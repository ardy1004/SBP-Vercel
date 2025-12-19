'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Clock, TrendingUp, MapPin, Home, Building, Star, X } from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'

interface AISearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

interface SearchSuggestion {
  type: 'suggestion' | 'recent' | 'popular' | 'location' | 'property'
  text: string
  icon: React.ReactNode
  category?: string
  trending?: boolean
}

export function AISearch({ onSearch, placeholder, className }: AISearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent.slice(0, 5)) // Limit to 5 recent searches
  }, [])

  // Generate AI-powered suggestions based on query
  useEffect(() => {
    if (query.length === 0) {
      // Show recent and popular when no query
      const popularSearches: SearchSuggestion[] = [
        { type: 'popular', text: 'Rumah murah di Sleman', icon: <TrendingUp className="w-4 h-4" />, trending: true },
        { type: 'popular', text: 'Apartemen di Yogyakarta', icon: <Building className="w-4 h-4" />, trending: true },
        { type: 'popular', text: 'Villa view gunung', icon: <Home className="w-4 h-4" />, trending: true },
        { type: 'popular', text: 'Kost dekat UGM', icon: <MapPin className="w-4 h-4" />, trending: true },
      ]

      const recentSuggestions: SearchSuggestion[] = recentSearches.map(search => ({
        type: 'recent' as const,
        text: search,
        icon: <Clock className="w-4 h-4" />
      }))

      setSuggestions([...popularSearches, ...recentSuggestions])
    } else if (query.length > 1) {
      // AI-powered suggestions based on query
      const aiSuggestions: SearchSuggestion[] = [
        {
          type: 'suggestion',
          text: `${query} murah`,
          icon: <Sparkles className="w-4 h-4" />,
          category: 'Harga'
        },
        {
          type: 'suggestion',
          text: `${query} premium`,
          icon: <Star className="w-4 h-4" />,
          category: 'Kualitas'
        },
        {
          type: 'suggestion',
          text: `${query} dekat pusat kota`,
          icon: <MapPin className="w-4 h-4" />,
          category: 'Lokasi'
        },
        {
          type: 'suggestion',
          text: `${query} dengan kolam renang`,
          icon: <Home className="w-4 h-4" />,
          category: 'Fasilitas'
        },
        {
          type: 'location',
          text: `${query} di Yogyakarta`,
          icon: <MapPin className="w-4 h-4" />,
          category: 'Lokasi'
        },
        {
          type: 'property',
          text: `Rumah ${query}`,
          icon: <Home className="w-4 h-4" />,
          category: 'Tipe'
        }
      ]

      // Filter suggestions that are relevant to the query
      const filteredSuggestions = aiSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(suggestion.text.toLowerCase().split(' ')[0])
      )

      setSuggestions(filteredSuggestions.slice(0, 6))
    } else {
      setSuggestions([])
    }
  }, [query, recentSearches])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updatedRecent)
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))

      onSearch?.(searchQuery.trim())
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex].text)
        } else {
          handleSearch(query)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text)
  }

  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedRecent = recentSearches.filter(s => s !== searchToRemove)
    setRecentSearches(updatedRecent)
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay closing to allow for suggestion clicks
            setTimeout(() => setIsOpen(false), 200)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Cari properti impian Anda..."}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              setSelectedIndex(-1)
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* AI Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.type}-${suggestion.text}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    suggestion.type === 'suggestion' ? 'bg-purple-100 text-purple-600' :
                    suggestion.type === 'popular' ? 'bg-orange-100 text-orange-600' :
                    suggestion.type === 'recent' ? 'bg-gray-100 text-gray-600' :
                    suggestion.type === 'location' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {suggestion.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium truncate">
                        {suggestion.text}
                      </span>
                      {suggestion.trending && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    {suggestion.category && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.category}
                      </div>
                    )}
                  </div>

                  {suggestion.type === 'recent' && (
                    <button
                      onClick={(e) => removeRecentSearch(suggestion.text, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}

                  {suggestion.type === 'suggestion' && (
                    <div className="flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>✨ Powered by AI</span>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                  <span>to navigate</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                  <span>to select</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Indicator */}
      {query.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-12 top-1/2 transform -translate-y-1/2"
        >
          <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>AI</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}