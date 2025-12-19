import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Property } from '@/types'

export function useFeaturedProperties(limit: number = 6) {
  return useQuery({
    queryKey: ['featured-properties', limit],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or('is_featured.eq.true,is_hot.eq.true,is_premium.eq.true')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.warn('Database not configured, using mock data:', error.message)
        // Return mock data if database is not available
        return getMockProperties()
      }

      // Transform database data to match our Property type
      return data?.map(transformDbProperty) || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

function transformDbProperty(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    kodeListing: dbProperty.kode_listing,
    judulProperti: dbProperty.judul_properti,
    deskripsi: dbProperty.deskripsi,
    jenisProperti: dbProperty.jenis_properti,
    hargaProperti: Number(dbProperty.harga_properti),
    hargaPerMeter: dbProperty.harga_per_meter || false,
    provinsi: dbProperty.provinsi,
    kabupaten: dbProperty.kabupaten,
    kecamatan: dbProperty.kecamatan,
    kelurahan: dbProperty.kelurahan,
    alamatLengkap: dbProperty.alamat_lengkap,
    luasTanah: dbProperty.luas_tanah ? Number(dbProperty.luas_tanah) : undefined,
    luasBangunan: dbProperty.luas_bangunan ? Number(dbProperty.luas_bangunan) : undefined,
    kamarTidur: dbProperty.kamar_tidur,
    kamarMandi: dbProperty.kamar_mandi,
    legalitas: dbProperty.legalitas,
    imageUrl: dbProperty.image_url,
    imageUrl1: dbProperty.image_url1,
    imageUrl2: dbProperty.image_url2,
    imageUrl3: dbProperty.image_url3,
    imageUrl4: dbProperty.image_url4,
    imageUrl5: dbProperty.image_url5,
    imageUrl6: dbProperty.image_url6,
    imageUrl7: dbProperty.image_url7,
    imageUrl8: dbProperty.image_url8,
    imageUrl9: dbProperty.image_url9,
    youtubeUrl: dbProperty.youtube_url,
    isPremium: dbProperty.is_premium || false,
    isFeatured: dbProperty.is_featured || false,
    isHot: dbProperty.is_hot || false,
    isSold: dbProperty.is_sold || false,
    priceOld: dbProperty.price_old ? Number(dbProperty.price_old) : undefined,
    isPropertyPilihan: dbProperty.is_property_pilihan || false,
    ownerContact: dbProperty.owner_contact,
    status: dbProperty.status,
    fts: dbProperty.fts,
    createdAt: new Date(dbProperty.created_at),
    updatedAt: new Date(dbProperty.updated_at)
  }
}

function getMockProperties(): Property[] {
  return [
    {
      id: 'd27a789d-d587-4226-acdd-6ef0cbf5622d',
      kodeListing: 'R1.08',
      judulProperti: 'Rumah Murah Cantik Minimalis Strategis 7mnt Ke UGM',
      deskripsi: 'Rumah Murah Cantik Minimalis, Strategis Dekat UGM - Hunian Idaman di Lokasi Premium!',
      jenisProperti: 'rumah',
      hargaProperti: 1100000000,
      hargaPerMeter: false,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: undefined,
      kelurahan: undefined,
      alamatLengkap: '',
      luasTanah: 123,
      luasBangunan: 100,
      kamarTidur: 3,
      kamarMandi: 2,
      legalitas: 'SHM',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      imageUrl1: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      imageUrl2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      isPremium: false,
      isFeatured: false,
      isHot: false,
      isSold: true,
      isPropertyPilihan: false,
      status: 'dijual',
      createdAt: new Date('2025-11-05T03:01:13.673785Z'),
      updatedAt: new Date('2025-11-05T09:52:58.286Z')
    },
    {
      id: 'a723f264-634a-429f-9001-77b3f12d7f61',
      kodeListing: 'R1.06',
      judulProperti: 'Homestay Dekat Hyatt Hotel, Utara UGM Jl Palagan Km 8, Jl Damai',
      deskripsi: 'Homestay Nyaman di Utara UGM - Investasi Cerdas di Jl Palagan Km 8, Jl Damai!',
      jenisProperti: 'rumah',
      hargaProperti: 1750000000,
      hargaPerMeter: false,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: undefined,
      kelurahan: undefined,
      alamatLengkap: '',
      luasTanah: 130,
      luasBangunan: 170,
      kamarTidur: 4,
      kamarMandi: 4,
      legalitas: 'SHM',
      imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      imageUrl1: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      imageUrl2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      imageUrl3: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      imageUrl4: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      isPremium: false,
      isFeatured: false,
      isHot: false,
      isSold: false,
      isPropertyPilihan: false,
      status: 'dijual',
      createdAt: new Date('2025-11-05T03:01:13.670034Z'),
      updatedAt: new Date('2025-11-05T09:52:58.29Z')
    },
    {
      id: '07d4d18f-9a5d-4eb4-8a53-bab5597c7d51',
      kodeListing: 'R1.04',
      judulProperti: 'Rumah Mewah Turun Harga! Dari 1,9M Jadi 1,65M (Nego)',
      deskripsi: 'Rumah Mewah Turun Harga di Merapi Regency - Kesempatan Emas!',
      jenisProperti: 'rumah',
      hargaProperti: 1650000000,
      hargaPerMeter: false,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: undefined,
      kelurahan: undefined,
      alamatLengkap: '',
      luasTanah: 117,
      luasBangunan: 135,
      kamarTidur: 4,
      kamarMandi: 3,
      legalitas: 'SHM',
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      imageUrl1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      imageUrl2: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      imageUrl3: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      imageUrl4: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      isPremium: false,
      isFeatured: false,
      isHot: false,
      isSold: false,
      isPropertyPilihan: false,
      status: 'dijual',
      createdAt: new Date('2025-11-05T03:01:13.666191Z'),
      updatedAt: new Date('2025-11-05T09:52:58.295Z')
    }
  ]
}