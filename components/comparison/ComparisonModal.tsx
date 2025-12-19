'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  X,
  Download,
  Share2,
  Star,
  MapPin,
  Ruler,
  Bed,
  Bath,
  Car,
  Home,
  Building2,
  Calendar,
  FileText
} from 'lucide-react'
import { useComparisonStore } from '@/stores/comparisonStore'
import { formatPriceNew } from '@/lib/utils'
import type { Property } from '@/types'
import Image from 'next/image'

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { selectedProperties, removeProperty, clearComparison } = useComparisonStore()
  const [activeTab, setActiveTab] = useState('overview')

  const formatValue = (property: Property, field: any) => {
    const value = property[field.key as keyof Property]

    switch (field.format) {
      case 'currency':
        return value ? formatPriceNew(value as number) : '-'
      case 'area':
        return value ? `${value}m²` : '-'
      case 'boolean':
        return value ? '✓' : '-'
      case 'date':
        return value ? new Date(value as Date).toLocaleDateString('id-ID') : '-'
      default:
        return String(value || '-')
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      rumah: '🏠',
      apartment: '🏙️',
      kost: '🏢',
      villa: '🏖️',
      ruko: '🏪',
      tanah: '🌱'
    }
    return icons[type] || '🏠'
  }

  const handleExport = () => {
    // Simple export functionality - in real app, this would generate PDF
    const data = selectedProperties.map(p => ({
      title: p.judulProperti,
      price: formatPriceNew(p.hargaProperti),
      location: `${p.kabupaten}, ${p.provinsi}`,
      type: p.jenisProperti,
      area: `${p.luasTanah || 0}m²`,
      bedrooms: p.kamarTidur || 0,
      bathrooms: p.kamarMandi || 0
    }))

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'property-comparison.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (selectedProperties.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Perbandingan Properti ({selectedProperties.length})
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearComparison}>
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="details">Detail Lengkap</TabsTrigger>
              <TabsTrigger value="location">Lokasi</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedProperties.length}, 1fr)` }}>
                {selectedProperties.map((property, index) => (
                  <Card key={property.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
                      onClick={() => removeProperty(property.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <CardHeader className="pb-2">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-2">
                        <Image
                          src={property.imageUrl}
                          alt={property.judulProperti || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                      <CardTitle className="text-sm line-clamp-2">
                        {property.judulProperti}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>{getPropertyTypeIcon(property.jenisProperti)}</span>
                        <span>{property.jenisProperti}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPriceNew(property.hargaProperti)}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">
                          {property.kabupaten}, {property.provinsi}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {property.luasTanah && (
                          <div className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            <span>{property.luasTanah}m²</span>
                          </div>
                        )}
                        {property.kamarTidur && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            <span>{property.kamarTidur}</span>
                          </div>
                        )}
                        {property.kamarMandi && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-3 h-3" />
                            <span>{property.kamarMandi}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {property.isPremium && <Badge className="text-xs bg-yellow-500">Premium</Badge>}
                        {property.isHot && <Badge className="text-xs bg-red-500">Hot</Badge>}
                        {property.isFeatured && <Badge className="text-xs bg-cyan-500">Featured</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 w-48">
                        Spesifikasi
                      </th>
                      {selectedProperties.map((property) => (
                        <th key={property.id} className="text-left py-3 px-4 font-medium min-w-64">
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-2 text-sm">
                              {property.judulProperti}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-2"
                              onClick={() => removeProperty(property.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'hargaProperti', label: 'Harga', icon: '💰' },
                      { key: 'jenisProperti', label: 'Tipe Properti', icon: '🏠' },
                      { key: 'luasTanah', label: 'Luas Tanah', icon: '📐' },
                      { key: 'luasBangunan', label: 'Luas Bangunan', icon: '🏗️' },
                      { key: 'kamarTidur', label: 'Kamar Tidur', icon: '🛏️' },
                      { key: 'kamarMandi', label: 'Kamar Mandi', icon: '🚿' },
                      { key: 'legalitas', label: 'Legalitas', icon: '📋' },
                      { key: 'kabupaten', label: 'Kota/Kabupaten', icon: '📍' },
                      { key: 'provinsi', label: 'Provinsi', icon: '🗺️' },
                      { key: 'isPremium', label: 'Premium', icon: '👑' },
                      { key: 'isHot', label: 'Hot Deal', icon: '🔥' },
                      { key: 'isFeatured', label: 'Featured', icon: '💎' }
                    ].map((field) => (
                      <tr key={field.key} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <span>{field.icon}</span>
                            <span>{field.label}</span>
                          </div>
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="py-3 px-4">
                            {formatValue(property, { key: field.key, format: field.key === 'hargaProperti' ? 'currency' : field.key.includes('luas') ? 'area' : field.key.startsWith('is') ? 'boolean' : 'text' })}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedProperties.length}, 1fr)` }}>
                {selectedProperties.map((property) => (
                  <Card key={property.id}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        {property.judulProperti}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeProperty(property.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{property.kelurahan && `${property.kelurahan}, `}{property.kecamatan && `${property.kecamatan}, `}{property.kabupaten}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{property.provinsi}</span>
                        </div>
                        {property.alamatLengkap && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-xs text-gray-600">{property.alamatLengkap}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}