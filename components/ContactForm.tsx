'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, User } from 'lucide-react'

interface ContactFormProps {
  propertyTitle?: string
}

type UserType = 'buyer' | 'seller' | 'broker'

interface FormData {
  userType: UserType | ''
  name: string
  originArea: string
  budget?: string
  paymentPlan?: string
  helpNeeded?: string
  purpose?: string
  propertyType?: string
  propertyLocation?: string
  message: string
}

export function ContactForm({ propertyTitle }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    name: '',
    originArea: '',
    budget: '',
    paymentPlan: '',
    helpNeeded: '',
    purpose: '',
    propertyType: '',
    propertyLocation: '',
    message: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.userType) {
      newErrors.userType = 'Pilih jenis pengguna'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi'
    }

    if (!formData.originArea.trim()) {
      newErrors.originArea = 'Asal daerah wajib diisi'
    }

    if (formData.userType === 'buyer') {
      if (!formData.budget) {
        newErrors.budget = 'Estimasi budget wajib dipilih'
      }
      if (!formData.paymentPlan) {
        newErrors.paymentPlan = 'Rencana pembayaran wajib dipilih'
      }
    }

    if (formData.userType === 'seller' && !formData.helpNeeded) {
      newErrors.helpNeeded = 'Pilih bantuan yang dibutuhkan'
    }

    if (formData.userType === 'seller' && formData.helpNeeded === 'Saya Ingin Titip Jual Properti?') {
      if (!formData.propertyType) {
        newErrors.propertyType = 'Pilih jenis properti'
      }
      if (!formData.propertyLocation?.trim()) {
        newErrors.propertyLocation = 'Lokasi properti wajib diisi'
      }
    }

    if (formData.userType === 'broker' && !formData.purpose) {
      newErrors.purpose = 'Pilih tujuan Anda'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateWhatsAppMessage = (): string => {
    const baseMessage = `*Halo Monica Vera S!*\n\n`

    let propertyInfo = ''
    if (propertyTitle) {
      const propertyUrl = window.location.href
      propertyInfo = `Saya tertarik dengan properti:\n*${propertyTitle}*\n${propertyUrl}\n\n`
    }

    let userTypeText = ''
    let specificInfo = ''

    switch (formData.userType) {
      case 'buyer':
        userTypeText = '*Saya Adalah Calon Pembeli*'
        specificInfo = `Nama: ${formData.name}\nAsal Daerah: ${formData.originArea}\nEstimasi Budget: ${formData.budget}\nRencana Pembayaran: ${formData.paymentPlan}`
        break
      case 'seller':
        userTypeText = 'Saya Adalah Penjual / Pemilik Properti'
        specificInfo = `Nama: ${formData.name}\nAsal Daerah: ${formData.originArea}\nBantuan yang dibutuhkan: ${formData.helpNeeded}`

        if (formData.helpNeeded === 'Saya Ingin Titip Jual Properti?') {
          specificInfo += `\nJenis Properti: ${formData.propertyType}\nLokasi Properti: ${formData.propertyLocation}`
        }
        break
      case 'broker':
        userTypeText = 'Saya Adalah Broker / Agent Properti'
        specificInfo = `Nama: ${formData.name}\nAsal Daerah: ${formData.originArea}\nTujuan: ${formData.purpose}`
        break
    }

    let message = baseMessage + propertyInfo + userTypeText + '\n\n' + specificInfo

    if (formData.message.trim()) {
      message += `\n\nPesan: ${formData.message}`
    }

    message += '\n\nMohon informasi lebih lanjut.'

    return encodeURIComponent(message)
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/6281391278889?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kirim Pesan Ke Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Admin Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Monica Vera S</h3>
            <p className="text-gray-600">Admin / Agent Properti</p>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="userType">Beritahu Kami Siapakah Anda? <span className="text-red-500">*</span></Label>
          <Select
            value={formData.userType}
            onValueChange={(value: UserType) => updateFormData('userType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis pengguna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Saya Adalah Calon Pembeli</SelectItem>
              <SelectItem value="seller">Saya Adalah Penjual / Pemilik Properti</SelectItem>
              <SelectItem value="broker">Saya Adalah Broker / Agent Properti</SelectItem>
            </SelectContent>
          </Select>
          {errors.userType && <p className="text-red-500 text-sm">{errors.userType}</p>}
        </div>

        {/* Conditional Fields */}
        {formData.userType && (
          <>
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Masukkan nama Anda"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Origin Area Field */}
            <div className="space-y-2">
              <Label htmlFor="originArea">Asal Daerah <span className="text-red-500">*</span></Label>
              <Input
                id="originArea"
                value={formData.originArea}
                onChange={(e) => updateFormData('originArea', e.target.value)}
                placeholder="Masukkan asal daerah Anda"
              />
              {errors.originArea && <p className="text-red-500 text-sm">{errors.originArea}</p>}
            </div>

            {/* Buyer Fields */}
            {formData.userType === 'buyer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimasi Budget <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => updateFormData('budget', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih estimasi budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dibawah 1M">Dibawah 1M</SelectItem>
                      <SelectItem value="1M-2M">1M-2M</SelectItem>
                      <SelectItem value="2M-3M">2M-3M</SelectItem>
                      <SelectItem value="3M-4M">3M-4M</SelectItem>
                      <SelectItem value="4M-5M">4M-5M</SelectItem>
                      <SelectItem value="5M-6M">5M-6M</SelectItem>
                      <SelectItem value="6M-7M">6M-7M</SelectItem>
                      <SelectItem value="7M-8M">7M-8M</SelectItem>
                      <SelectItem value="8M-9M">8M-9M</SelectItem>
                      <SelectItem value="9M-10M">9M-10M</SelectItem>
                      <SelectItem value="Diatas 10M">Diatas 10M</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentPlan">Rencana Pembayaran <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.paymentPlan}
                    onValueChange={(value) => updateFormData('paymentPlan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih rencana pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hard Cash">Hard Cash</SelectItem>
                      <SelectItem value="Soft Cash">Soft Cash</SelectItem>
                      <SelectItem value="KPR/Pembiayaan Bank">KPR/Pembiayaan Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentPlan && <p className="text-red-500 text-sm">{errors.paymentPlan}</p>}
                </div>
              </>
            )}

            {/* Seller Fields */}
            {formData.userType === 'seller' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="helpNeeded">Apa yang bisa kami bantu? <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.helpNeeded}
                    onValueChange={(value) => updateFormData('helpNeeded', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bantuan yang dibutuhkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saya Ingin Titip Jual Properti?">Saya Ingin Titip Jual Properti?</SelectItem>
                      <SelectItem value="Saya Mau Konsultasi">Saya Mau Konsultasi</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.helpNeeded && <p className="text-red-500 text-sm">{errors.helpNeeded}</p>}
                </div>

                {/* Additional fields for property listing */}
                {formData.helpNeeded === 'Saya Ingin Titip Jual Properti?' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Jenis Properti <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => updateFormData('propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis properti" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Rumah">Rumah</SelectItem>
                          <SelectItem value="Tanah">Tanah</SelectItem>
                          <SelectItem value="Kost">Kost</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Homestay/Guesthouse">Homestay/Guesthouse</SelectItem>
                          <SelectItem value="Ruko">Ruko</SelectItem>
                          <SelectItem value="Bangunan Komersial Lainnya">Bangunan Komersial Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyLocation">Lokasi Properti <span className="text-red-500">*</span></Label>
                      <Input
                        id="propertyLocation"
                        value={formData.propertyLocation}
                        onChange={(e) => updateFormData('propertyLocation', e.target.value)}
                        placeholder="Masukkan lokasi properti"
                      />
                      {errors.propertyLocation && <p className="text-red-500 text-sm">{errors.propertyLocation}</p>}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Broker Fields */}
            {formData.userType === 'broker' && (
              <div className="space-y-2">
                <Label htmlFor="purpose">Apa Tujuan Anda? <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => updateFormData('purpose', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tujuan Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apakah Bisa Bekerjasama?">Apakah Bisa Bekerjasama?</SelectItem>
                    <SelectItem value="Saya Mau Konsultasi">Saya Mau Konsultasi</SelectItem>
                  </SelectContent>
                </Select>
                {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose}</p>}
              </div>
            )}

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Pesan Tambahan (Opsional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('message', e.target.value)}
                placeholder="Tulis pesan tambahan jika ada..."
                rows={3}
              />
            </div>

            {/* WhatsApp Button */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Kirim via WhatsApp
            </Button>
          </>
        )}

        {/* Response Time */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Kami akan merespons dalam 1-2 jam kerja
        </div>
      </CardContent>
    </Card>
  )
}