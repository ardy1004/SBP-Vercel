'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageVariants } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabase";
import { parsePropertySlug } from "@/lib/utils/slug";
import type { Property } from "@shared/types";
import { Suspense, lazy } from "react";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyContact } from "@/components/property/PropertyContact";
import { PropertyInfo } from "@/components/property/PropertyInfo";

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

  const formatPrice = (price: any, isPerMeter: boolean = false) => {
    // Handle different price types (string, number, null, undefined)
    let priceStr = '';
    if (typeof price === 'number') {
      priceStr = price.toString();
    } else if (typeof price === 'string') {
      priceStr = price;
    } else {
      return 'Harga tidak tersedia';
    }

    const num = parseFloat(priceStr.replace(/[^\d.-]/g, ''));
    if (isNaN(num)) {
      return 'Harga tidak valid';
    }

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
      {/* Structured Data for Property */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.judulProperti,
            "description": property.deskripsi,
            "image": propertyImages,
            "url": `https://sbp-vercel.vercel.app/properties/${Array.isArray(params.slug) ? params.slug.join('-') : params.slug}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": property.alamatLengkap,
              "addressLocality": property.kabupaten,
              "addressRegion": property.provinsi,
              "addressCountry": "ID"
            },
            "offers": {
              "@type": "Offer",
              "price": typeof property.hargaProperti === 'string'
                ? parseFloat(property.hargaProperti.replace(/[^\d]/g, '')) || 0
                : typeof property.hargaProperti === 'number'
                ? property.hargaProperti
                : 0,
              "priceCurrency": "IDR",
              "availability": property.status === 'dijual' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Salam Bumi Property",
                "telephone": property.ownerContact
              }
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Luas Tanah",
                "value": property.luasTanah,
                "unitText": "m²"
              },
              {
                "@type": "PropertyValue",
                "name": "Luas Bangunan",
                "value": property.luasBangunan,
                "unitText": "m²"
              },
              {
                "@type": "PropertyValue",
                "name": "Kamar Tidur",
                "value": property.kamarTidur
              },
              {
                "@type": "PropertyValue",
                "name": "Kamar Mandi",
                "value": property.kamarMandi
              }
            ],
            "floorSize": property.luasBangunan ? {
              "@type": "QuantitativeValue",
              "value": property.luasBangunan,
              "unitText": "m²"
            } : undefined,
            "numberOfRooms": property.kamarTidur,
            "numberOfBathroomsTotal": property.kamarMandi,
            "propertyType": property.jenisProperti,
            "datePosted": property.createdAt?.toISOString(),
            "provider": {
              "@type": "Organization",
              "name": "Salam Bumi Property",
              "url": "https://sbp-vercel.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sbp-vercel.vercel.app/logo.png"
              }
            }
          })
        }}
      />
        <PropertyHeader
          title={property.judulProperti || 'Judul Properti'}
          location={property.alamatLengkap || `${property.kabupaten}, ${property.provinsi}`}
          price={formatPrice(property.hargaProperti, property.hargaPerMeter)}
        />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyImageGallery
              images={propertyImages}
              title={property.judulProperti || 'Property'}
              getImageVariants={getImageVariants}
            />

            <PropertyDetails
              luasTanah={property.luasTanah}
              luasBangunan={property.luasBangunan}
              kamarTidur={property.kamarTidur}
              kamarMandi={property.kamarMandi}
              deskripsi={property.deskripsi}
              jenisProperti={property.jenisProperti}
              status={property.status}
              legalitas={property.legalitas}
              isPremium={property.isPremium}
              isFeatured={property.isFeatured}
              isHot={property.isHot}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PropertyContact ownerContact={property.ownerContact} />

            {/* Favorites and Share */}
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

            <PropertyInfo
              kodeListing={property.kodeListing}
              status={property.status}
              jenisProperti={property.jenisProperti}
              createdAt={property.createdAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}