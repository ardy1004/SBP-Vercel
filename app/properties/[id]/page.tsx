import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { ContactForm } from '@/components/ContactForm'
import { ImmersiveGallery } from '@/components/properties/immersive-gallery'
import { SmartPropertyHeader } from '@/components/properties/smart-property-header'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Share2,
  Heart,
  ArrowLeft
} from 'lucide-react'
import type { Property } from '@/types'
import { formatPriceNew } from '@/lib/utils'

// Generate structured data for SEO
function generatePropertyStructuredData(property: Property) {
  const allImages = [
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
  ]

  const images = allImages.filter((img): img is string =>
    img !== undefined && img !== null && !img.startsWith('data:')
  )

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.judulProperti,
    "description": property.deskripsi,
    "url": `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properties/${property.id}`,
    "image": images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.kelurahan || property.kecamatan || property.kabupaten,
      "addressRegion": property.kabupaten,
      "addressCountry": "ID"
    },
    "geo": property.kelurahan || property.kecamatan ? {
      "@type": "GeoCoordinates",
      "address": `${property.kelurahan || ''} ${property.kecamatan || ''} ${property.kabupaten} ${property.provinsi}`.trim()
    } : undefined,
    "numberOfRooms": property.kamarTidur,
    "numberOfBathroomsTotal": property.kamarMandi,
    "floorSize": property.luasBangunan ? {
      "@type": "QuantitativeValue",
      "value": property.luasBangunan,
      "unitText": "m²"
    } : undefined,
    "lotSize": property.luasTanah ? {
      "@type": "QuantitativeValue",
      "value": property.luasTanah,
      "unitText": "m²"
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": property.hargaProperti,
      "priceCurrency": "IDR",
      "availability": property.isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": "Salam Bumi Property"
      }
    },
    "additionalProperty": [
      property.legalitas ? {
        "@type": "PropertyValue",
        "name": "Legalitas",
        "value": property.legalitas
      } : null
    ].filter(Boolean)
  }
}

// Enable ISR (Incremental Static Regeneration) for better performance
export const revalidate = 3600 // Revalidate every hour
export const dynamicParams = true // Allow dynamic params for ISR

// Pre-generate static pages for popular properties
export async function generateStaticParams() {
  try {
    // Generate static pages for premium and featured properties
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties?limit=20&isPremium=true&isFeatured=true`, {
      cache: 'force-cache'
    })

    if (!res.ok) return []

    const data = await res.json()
    const properties = data.properties || []

    return properties.map((property: any) => ({
      id: property.id
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties/${id}`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: 'Properti Tidak Ditemukan | Salam Bumi Property',
      description: 'Properti yang Anda cari tidak ditemukan. Temukan properti impian Anda di Salam Bumi Property.',
      keywords: 'properti, rumah, apartemen, tanah, sewa, jual',
      openGraph: {
        title: 'Properti Tidak Ditemukan | Salam Bumi Property',
        description: 'Properti yang Anda cari tidak ditemukan.',
        type: 'website',
      },
    }
  }

  const title = `${property.judulProperti} - ${property.kodeListing} | Salam Bumi Property`
  const description = property.deskripsi?.substring(0, 160) || `Lihat detail properti ${property.judulProperti} di ${property.kabupaten || 'Yogyakarta'}. ${property.jenisProperti} dengan harga ${formatPriceNew(property.hargaProperti)}.`

  // Get the first valid image URL
  const imageUrl = property.imageUrl?.startsWith('data:') ? null : property.imageUrl

  return {
    title,
    description,
    keywords: `${property.jenisProperti}, ${property.kabupaten}, ${property.provinsi}, properti, rumah, sewa, jual, ${property.kodeListing}`,
    authors: [{ name: 'Salam Bumi Property' }],
    openGraph: {
      title,
      description,
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: property.judulProperti,
      }] : [],
      type: 'article',
      publishedTime: new Date(property.createdAt).toISOString(),
      modifiedTime: new Date(property.updatedAt).toISOString(),
      authors: ['Salam Bumi Property'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properties/${id}`,
    },
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

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
  ].filter(Boolean) as string[]

  const getPropertyTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      rumah: '🏠 Rumah',
      kost: '🏢 Kost',
      apartment: '🏙️ Apartment',
      villa: '🏖️ Villa',
      gudang: '📦 Gudang',
      ruko: '🏪 Ruko',
      tanah: '🌱 Tanah',
      bangunan_komersial: '🏢 Komersial',
      hotel: '🏨 Hotel'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  };

  const getLocationDisplay = () => {
    const parts = [];
    if (property.kelurahan) parts.push(property.kelurahan);
    if (property.kecamatan) parts.push(property.kecamatan);
    if (property.kabupaten) parts.push(property.kabupaten.charAt(0).toUpperCase() + property.kabupaten.slice(1));
    if (property.provinsi) parts.push(property.provinsi.charAt(0).toUpperCase() + property.provinsi.slice(1));

    return parts.join(', ');
  };

  const structuredData = generatePropertyStructuredData(property)

  return (
    <ErrorBoundary>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Smart Property Header */}
        <SmartPropertyHeader property={property} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Immersive Gallery */}
              <ImmersiveGallery property={property} />

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <header className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2" id="property-title">
                        {property.judulProperti}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2" aria-label={`Kode listing: ${property.kodeListing}`}>
                        {property.kodeListing}
                      </p>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2 text-gray-400" aria-hidden="true" />
                        <span aria-label={`Lokasi: ${getLocationDisplay()}`}>
                          {getLocationDisplay()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-lg px-3 py-1"
                      aria-label={`Tipe properti: ${getPropertyTypeLabel(property.jenisProperti)}`}
                    >
                      {getPropertyTypeLabel(property.jenisProperti)}
                    </Badge>
                  </header>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {formatPriceNew(property.hargaProperti)}
                    </div>
                    {property.hargaPerMeter && (
                      <p className="text-sm text-gray-600">
                        ({formatPriceNew(property.hargaProperti / (property.luasTanah || 1), { isPerMeter: true })})
                      </p>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                    {property.luasTanah && (
                      <div className="text-center">
                        <Maximize className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{property.luasTanah}m²</div>
                        <div className="text-sm text-gray-600">Luas Tanah</div>
                      </div>
                    )}

                    {property.luasBangunan && (
                      <div className="text-center">
                        <Maximize className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{property.luasBangunan}m²</div>
                        <div className="text-sm text-gray-600">Luas Bangunan</div>
                      </div>
                    )}

                    {property.kamarTidur && (
                      <div className="text-center">
                        <Bed className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{property.kamarTidur}</div>
                        <div className="text-sm text-gray-600">Kamar Tidur</div>
                      </div>
                    )}

                    {property.kamarMandi && (
                      <div className="text-center">
                        <Bath className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{property.kamarMandi}</div>
                        <div className="text-sm text-gray-600">Kamar Mandi</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Deskripsi</h3>
                    <div className="prose max-w-none">
                      {property.deskripsi?.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Video */}
                  {property.youtubeUrl && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Video Properti</h3>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${property.youtubeUrl.split('v=')[1] || property.youtubeUrl.split('/').pop()}`}
                          title="Property Video"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Legal Information */}
                  {property.legalitas && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Informasi Legal</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {property.legalitas}
                        </Badge>
                        <span className="text-gray-600">Status legal properti</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <ContactForm propertyTitle={property.judulProperti} />

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipe Properti</span>
                    <span className="font-medium">{getPropertyTypeLabel(property.jenisProperti)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={property.status === 'dijual' ? 'default' : 'secondary'}>
                      {property.status === 'dijual' ? 'Dijual' : 'Disewakan'}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat</span>
                    <span className="font-medium">
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString('id-ID') : 'Tidak tersedia'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Terakhir Update</span>
                    <span className="font-medium">
                      {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString('id-ID') : 'Tidak tersedia'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <EnhancedButton variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Simpan ke Favorit
                </EnhancedButton>

                <EnhancedButton variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan Properti
                </EnhancedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}