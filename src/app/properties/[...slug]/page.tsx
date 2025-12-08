'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Heart, Phone, MessageCircle, Share2, Eye, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ImageVariants } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabase";
import { parsePropertySlug } from "@/lib/utils/slug";
import type { Property } from "@shared/types";
import { Suspense, lazy } from "react";

// Lazy load heavy components
const ShareButtons = lazy(() => import("@/components/ShareButtons").then(module => ({ default: module.ShareButtons })));

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string[];

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Parse slug using the utility function
  const slugInfo = parsePropertySlug(slug.join('-'));

  // Fetch property based on slug
  const { data: property, isLoading, error } = useQuery<Property | null>({
    queryKey: ['property-detail', slug?.join('/')],
    queryFn: async () => {
      if (!slugInfo) return null;

      console.log('🔍 PropertyDetailPage: Searching for property with slug info:', slugInfo);

      // First try exact match by kode_listing if available (most accurate)
      if (slugInfo.kode_listing) {
        console.log('🔍 PropertyDetailPage: Searching by kode_listing:', slugInfo.kode_listing);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('kode_listing', slugInfo.kode_listing)
          .limit(1);

        if (!error && data && data.length > 0) {
          console.log('✅ PropertyDetailPage: Found property by kode_listing:', data[0].id);
          return transformSupabaseProperty(data[0]);
        }
      }

      // Fallback: try exact match with all fields
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', slugInfo.status || '')
        .eq('jenis_properti', slugInfo.jenis_properti || '');

      if (slugInfo.provinsi) {
        query = query.ilike('provinsi', slugInfo.provinsi);
      }
      if (slugInfo.kabupaten) {
        query = query.ilike('kabupaten', slugInfo.kabupaten);
      }

      if (slugInfo.judul_properti) {
        query = query.ilike('judul_properti', `%${slugInfo.judul_properti}%`);
      }

      const { data, error } = await query.limit(1);

      if (error) {
        console.error('❌ PropertyDetailPage: Supabase query error:', error);
      }

      // If we found a property with exact match, return it
      if (data && data.length > 0) {
        console.log('✅ PropertyDetailPage: Found property with exact match:', data[0].id);
        return transformSupabaseProperty(data[0]);
      }

      // Try fallback search by combining multiple criteria
      console.log('🔄 PropertyDetailPage: No exact match, trying fallback search...');
      let fallbackQuery = supabase
        .from('properties')
        .select('*')
        .eq('status', slugInfo.status || '')
        .eq('jenis_properti', slugInfo.jenis_properti || '');

      // Add location criteria if available
      if (slugInfo.provinsi) {
        fallbackQuery = fallbackQuery.ilike('provinsi', slugInfo.provinsi);
      }
      if (slugInfo.kabupaten) {
        fallbackQuery = fallbackQuery.ilike('kabupaten', slugInfo.kabupaten);
      }

      // Add title search as additional filter
      if (slugInfo.judul_properti) {
        fallbackQuery = fallbackQuery.ilike('judul_properti', `%${slugInfo.judul_properti}%`);
      }

      const fallbackQueryFinal = fallbackQuery.limit(5);

      const { data: fallbackData, error: fallbackError } = await fallbackQueryFinal;

      if (fallbackError) {
        console.error('❌ PropertyDetailPage: Fallback query also failed:', fallbackError);
        return null;
      }

      // Find best match from fallback results
      const bestMatch = fallbackData?.find(p =>
        p.status === slugInfo.status &&
        p.jenis_properti === slugInfo.jenis_properti
      ) || fallbackData?.[0];

      if (bestMatch) {
        console.log('✅ PropertyDetailPage: Found property via fallback:', bestMatch.id);
        return transformSupabaseProperty(bestMatch);
      }

      console.log('❌ PropertyDetailPage: No property found with any search method');
      return null;
    },
    enabled: !!slugInfo,
  });

  // Transform Supabase data to Property type
  const transformSupabaseProperty = (supabaseProperty: any): Property => {
    return {
      id: supabaseProperty.id,
      kodeListing: supabaseProperty.kode_listing,
      judulProperti: supabaseProperty.judul_properti,
      deskripsi: supabaseProperty.deskripsi,
      jenisProperti: supabaseProperty.jenis_properti,
      luasTanah: supabaseProperty.luas_tanah,
      luasBangunan: supabaseProperty.luas_bangunan,
      kamarTidur: supabaseProperty.kamar_tidur,
      kamarMandi: supabaseProperty.kamar_mandi,
      legalitas: supabaseProperty.legalitas,
      hargaProperti: supabaseProperty.harga_properti,
      hargaPerMeter: Boolean(supabaseProperty.harga_per_meter || false),
      provinsi: supabaseProperty.provinsi,
      kabupaten: supabaseProperty.kabupaten,
      alamatLengkap: supabaseProperty.alamat_lengkap,
      imageUrl: supabaseProperty.image_url,
      imageUrl1: supabaseProperty.image_url1,
      imageUrl2: supabaseProperty.image_url2,
      imageUrl3: supabaseProperty.image_url3,
      imageUrl4: supabaseProperty.image_url4,
      imageUrl5: supabaseProperty.image_url5,
      imageUrl6: supabaseProperty.image_url6,
      imageUrl7: supabaseProperty.image_url7,
      imageUrl8: supabaseProperty.image_url8,
      imageUrl9: supabaseProperty.image_url9,
      isPremium: supabaseProperty.is_premium,
      isFeatured: supabaseProperty.is_featured,
      isHot: supabaseProperty.is_hot,
      isSold: supabaseProperty.is_sold,
      priceOld: supabaseProperty.price_old,
      isPropertyPilihan: supabaseProperty.is_property_pilihan,
      ownerContact: supabaseProperty.owner_contact,
      status: supabaseProperty.status,
      createdAt: new Date(supabaseProperty.created_at),
      updatedAt: new Date(supabaseProperty.updated_at),
    };
  };

  const formatPrice = (price: string, isPerMeter: boolean = false) => {
    const num = parseFloat(price);
    if (isPerMeter) {
      if (num >= 1000000000) {
        const value = num / 1000000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
      } else if (num >= 1000000) {
        const value = num / 1000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
      }
      return `Rp ${num.toLocaleString('id-ID')}/m²`;
    } else {
      if (num >= 1000000000) {
        const value = num / 1000000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
      } else if (num >= 1000000) {
        const value = num / 1000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
      }
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
  };

  const getPropertyImages = (property: Property) => {
    const imageFields = [
      property.imageUrl,
      property.imageUrl1,
      property.imageUrl2,
      property.imageUrl3,
      property.imageUrl4,
      property.imageUrl5,
      property.imageUrl6,
      property.imageUrl7,
      property.imageUrl8,
      property.imageUrl9,
    ];

    const validImages: string[] = [];

    for (const img of imageFields) {
      if (img && img.trim() !== '') {
        try {
          new URL(img);
          validImages.push(img);
        } catch {
          continue;
        }
      }
    }

    // Ensure minimum 5 images, add placeholders if needed
    const propertyTypePlaceholders: Record<string, string> = {
      rumah: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      kost: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      ruko: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      tanah: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      gudang: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    };

    const placeholder = propertyTypePlaceholders[property.jenisProperti] ||
                       'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';

    // Add placeholders to reach minimum 5 images
    while (validImages.length < 5) {
      validImages.push(placeholder);
    }

    return validImages;
  };

  const getPropertyImage = (property: Property) => {
    return getPropertyImages(property)[0]; // Return first image as main image
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Properti Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">
              Maaf, properti yang Anda cari tidak dapat ditemukan atau sudah tidak tersedia.
            </p>
            <Button onClick={() => router.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const propertyImages = getPropertyImages(property);

  const getImageVariants = (imageUrl: string): ImageVariants | undefined => {
    if (imageUrl && imageUrl.includes('imagedelivery.net')) {
      const urlParts = imageUrl.split('/');
      const imageId = urlParts[urlParts.length - 2];
      const accountId = urlParts[3];

      if (imageId && accountId) {
        return {
          thumbnail: `https://imagedelivery.net/${accountId}/${imageId}/w=300,sharpen=1,format=auto`,
          small: `https://imagedelivery.net/${accountId}/${imageId}/w=600,sharpen=1,format=auto`,
          medium: `https://imagedelivery.net/${accountId}/${imageId}/w=800,sharpen=1,format=auto`,
          large: `https://imagedelivery.net/${accountId}/${imageId}/w=1200,sharpen=1,format=auto`,
          original: imageUrl
        };
      }
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.judulProperti}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {property.alamatLengkap || `${property.kabupaten}, ${property.provinsi}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(property.hargaProperti, property.hargaPerMeter)}
              </p>
              <p className="text-sm text-gray-500">Kode: {property.kodeListing}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative">
                  <ResponsiveImage
                    src={propertyImages[selectedImageIndex]}
                    variants={getImageVariants(propertyImages[selectedImageIndex])}
                    alt={`${property.judulProperti || 'Property'} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {propertyImages.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-3">
                    {propertyImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ResponsiveImage
                          src={image}
                          variants={getImageVariants(image)}
                          alt={`${property.judulProperti || 'Property'} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {propertyImages.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      +{propertyImages.length - 4} gambar lainnya
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Properti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.luasTanah && (
                    <div className="text-center">
                      <Maximize className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Luas Tanah</p>
                      <p className="font-semibold">{property.luasTanah} m²</p>
                    </div>
                  )}
                  {property.luasBangunan && (
                    <div className="text-center">
                      <Maximize className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Luas Bangunan</p>
                      <p className="font-semibold">{property.luasBangunan} m²</p>
                    </div>
                  )}
                  {property.kamarTidur && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Kamar Tidur</p>
                      <p className="font-semibold">{property.kamarTidur}</p>
                    </div>
                  )}
                  {property.kamarMandi && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Kamar Mandi</p>
                      <p className="font-semibold">{property.kamarMandi}</p>
                    </div>
                  )}
                </div>

                {property.deskripsi && (
                  <div>
                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                    <p className="text-gray-700 whitespace-pre-line">{property.deskripsi}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{property.jenisProperti}</Badge>
                  <Badge variant="outline">{property.status}</Badge>
                  {property.legalitas && <Badge variant="outline">{property.legalitas}</Badge>}
                  {property.isPremium && <Badge className="bg-yellow-500">Premium</Badge>}
                  {property.isFeatured && <Badge className="bg-cyan-500">Featured</Badge>}
                  {property.isHot && <Badge className="bg-orange-500">Hot</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Kontak Penjual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.ownerContact ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{property.ownerContact}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => window.open(`https://wa.me/${property.ownerContact?.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(`tel:${property.ownerContact}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Kontak tidak tersedia
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleFavorite(property.id)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {favorites.includes(property.id) ? 'Disukai' : 'Sukai'}
                  </Button>
                  <Suspense fallback={<Button variant="outline" disabled><Share2 className="w-4 h-4" /></Button>}>
                    <ShareButtons
                      property={property}
                      variant="compact"
                    />
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Properti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Listing:</span>
                  <span className="font-medium">{property.kodeListing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={property.status === 'dijual' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipe:</span>
                  <span className="font-medium">{property.jenisProperti}</span>
                </div>
                {property.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat:</span>
                    <span className="font-medium">
                      {new Date(property.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}