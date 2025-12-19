'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Heart,
  Share2,
  Eye,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Twitter,
  Link as LinkIcon,
  X,
  Check
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { formatPriceNew } from '@/lib/utils'
import type { Property } from '@/types'

interface SmartPropertyHeaderProps {
  property: Property
}

export function SmartPropertyHeader({ property }: SmartPropertyHeaderProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Properti', href: '/properties' },
    { label: property.jenisProperti, href: `/properties?jenis=${property.jenisProperti}` },
    { label: property.kabupaten, href: `/properties?kabupaten=${property.kabupaten}` },
    { label: property.judulProperti, href: '#' }
  ]

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      action: () => shareToWhatsApp()
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      action: () => shareToFacebook()
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      action: () => shareToTwitter()
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      color: 'text-gray-600',
      action: () => copyLink()
    }
  ]

  const shareToWhatsApp = () => {
    const text = `Lihat properti ini: ${property.judulProperti} - Rp ${property.hargaProperti.toLocaleString('id-ID')}`
    const url = `${window.location.origin}/properties/${property.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
  }

  const shareToFacebook = () => {
    const url = `${window.location.origin}/properties/${property.id}`
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToTwitter = () => {
    const text = `Lihat properti: ${property.judulProperti}`
    const url = `${window.location.origin}/properties/${property.id}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/properties/${property.id}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const getLocationDisplay = () => {
    const parts = []
    if (property.kelurahan) parts.push(property.kelurahan)
    if (property.kecamatan) parts.push(property.kecamatan)
    if (property.kabupaten) parts.push(property.kabupaten.charAt(0).toUpperCase() + property.kabupaten.slice(1))
    if (property.provinsi) parts.push(property.provinsi.charAt(0).toUpperCase() + property.provinsi.slice(1))
    return parts.join(', ')
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 overflow-x-auto">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-gray-900 font-medium truncate max-w-48">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors truncate max-w-32"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight flex-1">
                  {property.judulProperti}
                </h1>

                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 mt-2 flex-shrink-0"
                >
                  {property.kodeListing}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-lg">{getLocationDisplay()}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>Dilihat 247 kali</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>Disukai 23 orang</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Diperbarui {new Date(property.updatedAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="lg:text-right lg:min-w-80">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatPriceNew(property.hargaProperti)}
              </div>

              {property.hargaPerMeter && (
                <div className="text-lg text-gray-600 mb-4">
                  {formatPriceNew(property.hargaProperti / (property.luasTanah || 1), { isPerMeter: true })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSaved
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Tersimpan' : 'Simpan'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </motion.button>
              </div>

              {/* Quick Contact (Mobile) */}
              <div className="flex gap-2 mt-4 lg:hidden">
                <EnhancedButton
                  size="sm"
                  variant="success"
                  className="flex-1"
                  onClick={() => window.open('https://wa.me/6281391278889', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </EnhancedButton>
                <EnhancedButton
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open('tel:+6281391278889', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Telepon
                </EnhancedButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Bagikan Properti</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.action}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                    <span className="text-sm font-medium">{option.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={`${window.location.origin}/properties/${property.id}`}
                    readOnly
                    className="flex-1 bg-transparent border-0 text-sm focus:outline-none"
                  />
                  <EnhancedButton
                    size="sm"
                    variant="outline"
                    onClick={copyLink}
                    className="flex items-center gap-1"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </EnhancedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}