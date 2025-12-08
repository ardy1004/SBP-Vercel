'use client';

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import type { Property } from "@shared/types";

interface RelatedPropertiesProps {
  currentPropertyId?: string;
  location?: string;
  jenisProperti?: string;
  limit?: number;
}

export function RelatedProperties({
  currentPropertyId,
  location,
  jenisProperti,
  limit = 3
}: RelatedPropertiesProps) {
  const { data: relatedProperties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['related-properties', currentPropertyId, location, jenisProperti],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .neq('id', currentPropertyId || '')
        .eq('status', 'dijual')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Prioritize properties in same location and type
      if (location && jenisProperti) {
        query = query.or(`kabupaten.ilike.%${location}%,provinsi.ilike.%${location}%`);
      } else if (location) {
        query = query.or(`kabupaten.ilike.%${location}%,provinsi.ilike.%${location}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching related properties:', error);
        return [];
      }

      // Transform data
      return data?.map((item: any) => ({
        id: item.id,
        kodeListing: item.kode_listing,
        judulProperti: item.judul_properti,
        deskripsi: item.deskripsi,
        jenisProperti: item.jenis_properti,
        luasTanah: item.luas_tanah,
        luasBangunan: item.luas_bangunan,
        kamarTidur: item.kamar_tidur,
        kamarMandi: item.kamar_mandi,
        legalitas: item.legalitas,
        hargaProperti: item.harga_properti,
        hargaPerMeter: Boolean(item.harga_per_meter || false),
        provinsi: item.provinsi,
        kabupaten: item.kabupaten,
        alamatLengkap: item.alamat_lengkap,
        imageUrl: item.image_url,
        imageUrl1: item.image_url1,
        imageUrl2: item.image_url2,
        imageUrl3: item.image_url3,
        imageUrl4: item.image_url4,
        imageUrl5: item.image_url5,
        imageUrl6: item.image_url6,
        imageUrl7: item.image_url7,
        imageUrl8: item.image_url8,
        imageUrl9: item.image_url9,
        isPremium: item.is_premium,
        isFeatured: item.is_featured,
        isHot: item.is_hot,
        isSold: item.is_sold,
        priceOld: item.price_old,
        isPropertyPilihan: item.is_property_pilihan,
        ownerContact: item.owner_contact,
        status: item.status,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      })) || [];
    },
    enabled: !!currentPropertyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lihat Properti Lainnya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !relatedProperties || relatedProperties.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lihat Properti Lainnya</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onToggleFavorite={() => {}} // Placeholder, bisa diimplementasikan nanti
              isFavorite={false} // Placeholder
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}