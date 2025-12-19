'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react'
import type { Property } from '@/types'

// Mock data - in real app, this would come from API
const mockProperties: Property[] = [
  {
    id: '1',
    kodeListing: 'RUM-001',
    judulProperti: 'Rumah Minimalis Modern Condongcatur',
    jenisProperti: 'rumah',
    hargaProperti: 500000000,
    hargaPerMeter: false,
    provinsi: 'Daerah Istimewa Yogyakarta',
    kabupaten: 'Sleman',
    kecamatan: 'Depok',
    kelurahan: 'Caturtunggal',
    alamatLengkap: 'Jl. Malioboro No. 123',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: '',
    imageUrl6: '',
    imageUrl7: '',
    imageUrl8: '',
    imageUrl9: '',
    youtubeUrl: '',
    isPremium: true,
    isFeatured: false,
    isHot: true,
    isSold: false,
    priceOld: undefined,
    isPropertyPilihan: true,
    ownerContact: '',
    status: 'dijual',
    fts: undefined,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    kodeListing: 'APT-002',
    judulProperti: 'Apartemen Mewah City Center',
    jenisProperti: 'apartment',
    hargaProperti: 750000000,
    hargaPerMeter: false,
    provinsi: 'Daerah Istimewa Yogyakarta',
    kabupaten: 'Yogyakarta',
    kecamatan: 'Danurejan',
    kelurahan: 'Gondokusuman',
    alamatLengkap: 'Jl. Sudirman No. 45',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: '',
    imageUrl6: '',
    imageUrl7: '',
    imageUrl8: '',
    imageUrl9: '',
    youtubeUrl: '',
    isPremium: false,
    isFeatured: true,
    isHot: false,
    isSold: false,
    priceOld: undefined,
    isPropertyPilihan: false,
    ownerContact: '',
    status: 'dijual',
    fts: undefined,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  }
]

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.judulProperti?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.kodeListing.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    return status === 'dijual' ? (
      <Badge className="bg-green-100 text-green-800">Dijual</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Disewakan</Badge>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">Manage your property listings and inventory</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => !p.isSold).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Premium Properties</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => p.isPremium).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold">
                  {new Set(properties.map(p => p.kabupaten)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'dijual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('dijual')}
              >
                Dijual
              </Button>
              <Button
                variant={statusFilter === 'disewakan' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('disewakan')}
              >
                Disewakan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.imageUrl}
                          alt={property.judulProperti || ''}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.judulProperti}
                          </p>
                          <p className="text-sm text-gray-500">
                            {property.kodeListing}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {property.kecamatan && property.kelurahan
                            ? `${property.kelurahan}, ${property.kecamatan}`
                            : property.kabupaten}
                        </p>
                        <p className="text-gray-500">{property.provinsi}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {formatPrice(property.hargaProperti)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">
                        {property.jenisProperti}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/properties/${property.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first property'}
              </p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}