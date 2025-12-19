'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import type { Property } from '@/types'

// Mock location data - in real app, this would come from API
const provinces = [
  { id: 1, name: 'Daerah Istimewa Yogyakarta', code: 'DIY' }
]

const districts = [
  { id: 1, name: 'Sleman', provinceId: 1 },
  { id: 2, name: 'Yogyakarta', provinceId: 1 },
  { id: 3, name: 'Bantul', provinceId: 1 },
  { id: 4, name: 'Gunungkidul', provinceId: 1 },
  { id: 5, name: 'Kulon Progo', provinceId: 1 }
]

const subdistricts = [
  { id: 1, name: 'Depok', districtId: 1 },
  { id: 2, name: 'Gamping', districtId: 1 },
  { id: 3, name: 'Mlati', districtId: 1 },
  { id: 4, name: 'Moyudan', districtId: 1 },
  { id: 5, name: 'Ngaglik', districtId: 1 },
  { id: 6, name: 'Sleman', districtId: 1 },
  { id: 7, name: 'Tempel', districtId: 1 },
  { id: 8, name: 'Danurejan', districtId: 2 },
  { id: 9, name: 'Gedongtengen', districtId: 2 },
  { id: 10, name: 'Gondokusuman', districtId: 2 }
]

const villages = [
  { id: 1, name: 'Caturtunggal', subdistrictId: 1, postalCode: '55281' },
  { id: 2, name: 'Condongcatur', subdistrictId: 1, postalCode: '55283' },
  { id: 3, name: 'Depok', subdistrictId: 1, postalCode: '55281' },
  { id: 4, name: 'Kemiri', subdistrictId: 1, postalCode: '55281' },
  { id: 5, name: 'Maguwoharjo', subdistrictId: 1, postalCode: '55282' },
  { id: 6, name: 'Gondokusuman', subdistrictId: 10, postalCode: '55221' }
]

const propertyTypes = [
  { value: 'rumah', label: '🏠 Rumah' },
  { value: 'apartment', label: '🏙️ Apartment' },
  { value: 'kost', label: '🏢 Kost' },
  { value: 'villa', label: '🏖️ Villa' },
  { value: 'ruko', label: '🏪 Ruko' },
  { value: 'tanah', label: '🌱 Tanah' },
  { value: 'gudang', label: '📦 Gudang' },
  { value: 'bangunan_komersial', label: '🏢 Komersial' },
  { value: 'hotel', label: '🏨 Hotel' }
]

const legalStatuses = [
  'SHM', 'SHGB', 'PPJB', 'Girik', 'Letter C', 'SHM & PBG', 'SHGB & PBG'
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')

  const [formData, setFormData] = useState({
    kodeListing: '',
    judulProperti: '',
    deskripsi: '',
    jenisProperti: '',
    hargaProperti: '',
    hargaPerMeter: false,
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    kelurahan: '',
    alamatLengkap: '',
    luasTanah: '',
    luasBangunan: '',
    kamarTidur: '',
    kamarMandi: '',
    legalitas: '',
    imageUrl: '',
    isPremium: false,
    isFeatured: false,
    isHot: false,
    status: 'dijual'
  })

  const filteredDistricts = districts.filter(d => d.provinceId.toString() === selectedProvince)
  const filteredSubdistricts = subdistricts.filter(s => s.districtId.toString() === selectedDistrict)
  const filteredVillages = villages.filter(v => v.subdistrictId.toString() === selectedSubdistrict)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Reset dependent fields when parent changes
    if (field === 'provinsi') {
      setSelectedProvince(value as string)
      setFormData(prev => ({
        ...prev,
        kabupaten: '',
        kecamatan: '',
        kelurahan: ''
      }))
      setSelectedDistrict('')
      setSelectedSubdistrict('')
      setSelectedVillage('')
    } else if (field === 'kabupaten') {
      setSelectedDistrict(value as string)
      setFormData(prev => ({
        ...prev,
        kecamatan: '',
        kelurahan: ''
      }))
      setSelectedSubdistrict('')
      setSelectedVillage('')
    } else if (field === 'kecamatan') {
      setSelectedSubdistrict(value as string)
      setFormData(prev => ({ ...prev, kelurahan: '' }))
      setSelectedVillage('')
    } else if (field === 'kelurahan') {
      setSelectedVillage(value as string)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In real app, this would make an API call
      console.log('Submitting property:', formData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to properties list
      router.push('/admin/properties')
    } catch (error) {
      console.error('Error creating property:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/properties">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-1">Create a new property listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Listing *
                </label>
                <Input
                  value={formData.kodeListing}
                  onChange={(e) => handleInputChange('kodeListing', e.target.value)}
                  placeholder="e.g., RUM-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={formData.jenisProperti}
                  onChange={(e) => handleInputChange('jenisProperti', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <Input
                value={formData.judulProperti}
                onChange={(e) => handleInputChange('judulProperti', e.target.value)}
                placeholder="e.g., Rumah Minimalis Modern 2 Lantai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the property..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province *
                </label>
                <select
                  value={formData.provinsi}
                  onChange={(e) => handleInputChange('provinsi', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District/City *
                </label>
                <select
                  value={formData.kabupaten}
                  onChange={(e) => handleInputChange('kabupaten', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedProvince}
                  required
                >
                  <option value="">Select District</option>
                  {filteredDistricts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subdistrict/Kecamatan
                </label>
                <select
                  value={formData.kecamatan}
                  onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Subdistrict</option>
                  {filteredSubdistricts.map(subdistrict => (
                    <option key={subdistrict.id} value={subdistrict.id}>
                      {subdistrict.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village/Kelurahan
                </label>
                <select
                  value={formData.kelurahan}
                  onChange={(e) => handleInputChange('kelurahan', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedSubdistrict}
                >
                  <option value="">Select Village</option>
                  {filteredVillages.map(village => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>
              <textarea
                value={formData.alamatLengkap}
                onChange={(e) => handleInputChange('alamatLengkap', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jl. Malioboro No. 123, Yogyakarta"
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land Area (m²)
                </label>
                <Input
                  type="number"
                  value={formData.luasTanah}
                  onChange={(e) => handleInputChange('luasTanah', e.target.value)}
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Area (m²)
                </label>
                <Input
                  type="number"
                  value={formData.luasBangunan}
                  onChange={(e) => handleInputChange('luasBangunan', e.target.value)}
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  value={formData.kamarTidur}
                  onChange={(e) => handleInputChange('kamarTidur', e.target.value)}
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  value={formData.kamarMandi}
                  onChange={(e) => handleInputChange('kamarMandi', e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legal Status
                </label>
                <select
                  value={formData.legalitas}
                  onChange={(e) => handleInputChange('legalitas', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Legal Status</option>
                  {legalStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="dijual">Dijual</option>
                  <option value="disewakan">Disewakan</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (IDR) *
                </label>
                <Input
                  type="number"
                  value={formData.hargaProperti}
                  onChange={(e) => handleInputChange('hargaProperti', e.target.value)}
                  placeholder="500000000"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-7">
                <input
                  type="checkbox"
                  id="hargaPerMeter"
                  checked={formData.hargaPerMeter}
                  onChange={(e) => handleInputChange('hargaPerMeter', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hargaPerMeter" className="text-sm text-gray-700">
                  Price per square meter
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Property Images</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to select files
              </p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        <Card>
          <CardHeader>
            <CardTitle>Special Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPremium" className="text-sm text-gray-700">
                  <Badge className="mr-2 bg-yellow-500">PREMIUM</Badge>
                  Mark as Premium Property
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isFeatured" className="text-sm text-gray-700">
                  <Badge className="mr-2 bg-cyan-500">FEATURED</Badge>
                  Mark as Featured Property
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isHot"
                  checked={formData.isHot}
                  onChange={(e) => handleInputChange('isHot', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isHot" className="text-sm text-gray-700">
                  <Badge className="mr-2 bg-orange-500">HOT</Badge>
                  Mark as Hot Property
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/properties">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Property'}
          </Button>
        </div>
      </form>
    </div>
  )
}