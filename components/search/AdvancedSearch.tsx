'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Filter,
  X,
  MapPin,
  DollarSign,
  Home,
  Ruler,
  Bed,
  Bath,
  Star,
  RotateCcw
} from 'lucide-react'
import { useSearchStore } from '@/stores/searchStore'
import type { PropertyType, PropertyStatus } from '@/types'

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: string }[] = [
  { value: 'rumah', label: 'Rumah', icon: '🏠' },
  { value: 'apartment', label: 'Apartment', icon: '🏙️' },
  { value: 'kost', label: 'Kost', icon: '🏢' },
  { value: 'villa', label: 'Villa', icon: '🏖️' },
  { value: 'ruko', label: 'Ruko', icon: '🏪' },
  { value: 'tanah', label: 'Tanah', icon: '🌱' },
  { value: 'gudang', label: 'Gudang', icon: '📦' },
  { value: 'bangunan_komersial', label: 'Komersial', icon: '🏢' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' }
]

const PROPERTY_STATUS: { value: PropertyStatus; label: string }[] = [
  { value: 'dijual', label: 'Dijual' },
  { value: 'disewakan', label: 'Disewakan' }
]

const LOCATIONS = {
  provinsi: ['DI.Yogyakarta', 'Jawa Tengah', 'Jawa Timur'],
  kabupaten: ['Sleman', 'Yogyakarta', 'Bantul', 'Kulon Progo', 'Gunung Kidul']
}

interface AdvancedSearchProps {
  onSearch?: () => void
  className?: string
}

export function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    query,
    filters,
    sortBy,
    hasActiveFilters,
    activeFilterCount,
    setQuery,
    setFilters,
    updateFilter,
    clearFilters,
    setSortBy
  } = useSearchStore()

  const handleSearch = () => {
    onSearch?.()
  }

  const handleClearFilters = () => {
    clearFilters()
    setQuery('')
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        {/* Main Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari lokasi, tipe properti, atau kode listing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant={hasActiveFilters ? "default" : "outline"}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            Cari
          </Button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Urutkan:</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="price_asc">Harga Terendah</SelectItem>
                <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                <SelectItem value="area_asc">Luas Terkecil</SelectItem>
                <SelectItem value="area_desc">Luas Terbesar</SelectItem>
                <SelectItem value="popular">Paling Populer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Filter
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t pt-4 space-y-6">
                {/* Location Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4" />
                      Provinsi
                    </label>
                    <Select
                      value={filters.provinsi || ''}
                      onValueChange={(value: string) => updateFilter('provinsi', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.provinsi.map(prov => (
                          <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4" />
                      Kabupaten
                    </label>
                    <Select
                      value={filters.kabupaten || ''}
                      onValueChange={(value: string) => updateFilter('kabupaten', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kabupaten" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.kabupaten.map(kab => (
                          <SelectItem key={kab} value={kab}>{kab}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2">Kecamatan</label>
                    <Input
                      placeholder="Masukkan kecamatan"
                      value={filters.kecamatan || ''}
                      onChange={(e) => updateFilter('kecamatan', e.target.value || undefined)}
                    />
                  </div>
                </div>

                {/* Property Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Home className="w-4 h-4" />
                      Tipe Properti
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROPERTY_TYPES.map(type => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.value}
                            checked={filters.jenisProperti?.includes(type.value) || false}
                            onCheckedChange={(checked: boolean) => {
                              const current = filters.jenisProperti || []
                              const updated = checked
                                ? [...current, type.value]
                                : current.filter(t => t !== type.value)
                              updateFilter('jenisProperti', updated.length > 0 ? updated : undefined)
                            }}
                          />
                          <label
                            htmlFor={type.value}
                            className="text-sm cursor-pointer flex items-center gap-1"
                          >
                            <span>{type.icon}</span>
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <DollarSign className="w-4 h-4" />
                      Status
                    </label>
                    <div className="space-y-2">
                      {PROPERTY_STATUS.map(status => (
                        <div key={status.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={status.value}
                            checked={filters.status?.includes(status.value) || false}
                            onCheckedChange={(checked: boolean) => {
                              const current = filters.status || []
                              const updated = checked
                                ? [...current, status.value]
                                : current.filter(s => s !== status.value)
                              updateFilter('status', updated.length > 0 ? updated : undefined)
                            }}
                          />
                          <label htmlFor={status.value} className="text-sm cursor-pointer">
                            {status.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <DollarSign className="w-4 h-4" />
                    Rentang Harga
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Harga Minimum</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.hargaMin || ''}
                        onChange={(e) => updateFilter('hargaMin', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Harga Maximum</label>
                      <Input
                        type="number"
                        placeholder="Tidak terbatas"
                        value={filters.hargaMax || ''}
                        onChange={(e) => updateFilter('hargaMax', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </div>

                {/* Area Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Ruler className="w-4 h-4" />
                      Luas Tanah (m²)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.luasTanahMin || ''}
                        onChange={(e) => updateFilter('luasTanahMin', e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.luasTanahMax || ''}
                        onChange={(e) => updateFilter('luasTanahMax', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Ruler className="w-4 h-4" />
                      Luas Bangunan (m²)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.luasBangunanMin || ''}
                        onChange={(e) => updateFilter('luasBangunanMin', e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.luasBangunanMax || ''}
                        onChange={(e) => updateFilter('luasBangunanMax', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </div>

                {/* Room Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Bed className="w-4 h-4" />
                      Kamar Tidur Minimal
                    </label>
                    <Select
                      value={filters.kamarTidurMin?.toString() || ''}
                      onValueChange={(value: string) => updateFilter('kamarTidurMin', value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tidak ada minimum" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-3">
                      <Bath className="w-4 h-4" />
                      Kamar Mandi Minimal
                    </label>
                    <Select
                      value={filters.kamarMandiMin?.toString() || ''}
                      onValueChange={(value: string) => updateFilter('kamarMandiMin', value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tidak ada minimum" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special Features */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Star className="w-4 h-4" />
                    Fitur Khusus
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="premium"
                        checked={filters.isPremium || false}
                        onCheckedChange={(checked: boolean) => updateFilter('isPremium', checked || undefined)}
                      />
                      <label htmlFor="premium" className="text-sm cursor-pointer">Premium</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={filters.isFeatured || false}
                        onCheckedChange={(checked: boolean) => updateFilter('isFeatured', checked || undefined)}
                      />
                      <label htmlFor="featured" className="text-sm cursor-pointer">Featured</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hot"
                        checked={filters.isHot || false}
                        onCheckedChange={(checked: boolean) => updateFilter('isHot', checked || undefined)}
                      />
                      <label htmlFor="hot" className="text-sm cursor-pointer">Hot Deal</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}