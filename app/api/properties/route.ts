import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { properties } from '@/lib/schema'
import { eq, desc, and, ilike, or } from 'drizzle-orm'
import type { Property } from '@/types'

function transformDbProperty(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    kodeListing: dbProperty.kode_listing,
    judulProperti: dbProperty.judul_properti,
    deskripsi: dbProperty.deskripsi,
    metaTitle: dbProperty.meta_title,
    metaDescription: dbProperty.meta_description,
    jenisProperti: dbProperty.jenis_properti,
    luasTanah: dbProperty.luas_tanah ? Number(dbProperty.luas_tanah) : undefined,
    luasBangunan: dbProperty.luas_bangunan ? Number(dbProperty.luas_bangunan) : undefined,
    kamarTidur: dbProperty.kamar_tidur,
    kamarMandi: dbProperty.kamar_mandi,
    legalitas: dbProperty.legalitas,
    hargaProperti: Number(dbProperty.harga_properti),
    hargaPerMeter: dbProperty.harga_per_meter || false,
    provinsi: dbProperty.provinsi,
    kabupaten: dbProperty.kabupaten,
    kecamatan: dbProperty.kecamatan,
    kelurahan: dbProperty.kelurahan,
    kecamatanId: dbProperty.kecamatan_id,
    kelurahanId: dbProperty.kelurahan_id,
    alamatLengkap: dbProperty.alamat_lengkap,
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

function getMockProperties(): any[] {
  return [
    {
      id: 'd27a789d-d587-4226-acdd-6ef0cbf5622d',
      kode_listing: 'R1.08',
      judul_properti: 'Rumah Murah Cantik Minimalis Strategis 7mnt Ke UGM',
      deskripsi: 'Rumah Murah Cantik Minimalis, Strategis Dekat UGM - Hunian Idaman di Lokasi Premium!',
      jenis_properti: 'rumah',
      luas_tanah: 123,
      luas_bangunan: 100,
      kamar_tidur: 3,
      kamar_mandi: 2,
      legalitas: 'SHM',
      harga_properti: 1100000000,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: null,
      kelurahan: null,
      alamat_lengkap: '',
      image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      image_url1: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      image_url2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      is_premium: false,
      is_featured: false,
      is_hot: false,
      is_sold: true,
      price_old: null,
      is_property_pilihan: false,
      owner_contact: '',
      status: 'dijual',
      fts: null,
      created_at: '2025-11-05T03:01:13.673785Z',
      updated_at: '2025-11-05T09:52:58.286Z'
    },
    {
      id: 'a723f264-634a-429f-9001-77b3f12d7f61',
      kode_listing: 'R1.06',
      judul_properti: 'Homestay Dekat Hyatt Hotel, Utara UGM Jl Palagan Km 8, Jl Damai',
      deskripsi: 'Homestay Nyaman di Utara UGM - Investasi Cerdas di Jl Palagan Km 8, Jl Damai!',
      jenis_properti: 'rumah',
      luas_tanah: 130,
      luas_bangunan: 170,
      kamar_tidur: 4,
      kamar_mandi: 4,
      legalitas: 'SHM',
      harga_properti: 1750000000,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: null,
      kelurahan: null,
      alamat_lengkap: '',
      image_url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      image_url1: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      image_url2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      image_url3: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      image_url4: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      is_premium: false,
      is_featured: false,
      is_hot: false,
      is_sold: false,
      price_old: null,
      is_property_pilihan: false,
      owner_contact: '',
      status: 'dijual',
      fts: null,
      created_at: '2025-11-05T03:01:13.670034Z',
      updated_at: '2025-11-05T09:52:58.29Z'
    },
    {
      id: '07d4d18f-9a5d-4eb4-8a53-bab5597c7d51',
      kode_listing: 'R1.04',
      judul_properti: 'Rumah Mewah Turun Harga! Dari 1,9M Jadi 1,65M (Nego)',
      deskripsi: 'Rumah Mewah Turun Harga di Merapi Regency - Kesempatan Emas!',
      jenis_properti: 'rumah',
      luas_tanah: 117,
      luas_bangunan: 135,
      kamar_tidur: 4,
      kamar_mandi: 3,
      legalitas: 'SHM',
      harga_properti: 1650000000,
      provinsi: 'DI.Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: null,
      kelurahan: null,
      alamat_lengkap: '',
      image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      image_url1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      image_url2: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      image_url3: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      image_url4: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      is_premium: false,
      is_featured: false,
      is_hot: false,
      is_sold: false,
      price_old: null,
      is_property_pilihan: false,
      owner_contact: '',
      status: 'dijual',
      fts: null,
      created_at: '2025-11-05T03:01:13.666191Z',
      updated_at: '2025-11-05T09:52:58.295Z'
    },
    {
      id: '934e6b2f-951e-4bc6-9081-a748128939a9',
      kode_listing: 'R2.01',
      judul_properti: 'Rumah Mewah Perum Elite Laguna Spring, Jl. Wonosari Km 7 - Hunian Impian Anda!',
      deskripsi: 'Rumah Mewah Type New Jasmine di Laguna Spring - Hunian Impian!',
      jenis_properti: 'rumah',
      luas_tanah: 130,
      luas_bangunan: 172,
      kamar_tidur: 4,
      kamar_mandi: 5,
      legalitas: 'SHM',
      harga_properti: 2550000000,
      provinsi: 'D.I Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: null,
      kelurahan: null,
      alamat_lengkap: '',
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      image_url1: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      image_url2: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      image_url3: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      image_url4: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      is_premium: false,
      is_featured: false,
      is_hot: false,
      is_sold: false,
      price_old: null,
      is_property_pilihan: false,
      owner_contact: '',
      status: 'dijual',
      fts: null,
      created_at: '2025-11-05T17:00:39.236937Z',
      updated_at: '2025-11-05T10:02:44.834Z'
    },
    {
      id: '0b233e58-7f62-41f8-aba7-bb81d4f6a3ba',
      kode_listing: 'R2.03',
      judul_properti: 'Hunian Cluster 2 Lantai Strategis di Jl Sorowajan Baru, Banguntapan!',
      deskripsi: 'Hunian Cluster 2 Lantai di Jl Sorowajan Baru - Lokasi Strategis!',
      jenis_properti: 'rumah',
      luas_tanah: 200,
      luas_bangunan: 130,
      kamar_tidur: 5,
      kamar_mandi: 4,
      legalitas: 'SHM',
      harga_properti: 1900000000,
      provinsi: 'D.I Yogyakarta',
      kabupaten: 'Sleman',
      kecamatan: null,
      kelurahan: null,
      alamat_lengkap: '',
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      image_url1: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
      image_url2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      image_url3: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      image_url4: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      is_premium: false,
      is_featured: false,
      is_hot: false,
      is_sold: true,
      price_old: null,
      is_property_pilihan: false,
      owner_contact: '',
      status: 'dijual',
      fts: null,
      created_at: '2025-11-05T17:00:39.404808Z',
      updated_at: '2025-11-05T10:04:07.129Z'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Location filters
    const provinsi = searchParams.get('provinsi')
    const kabupaten = searchParams.get('kabupaten')
    const kecamatan = searchParams.get('kecamatan')
    const kelurahan = searchParams.get('kelurahan')

    // Property filters
    const jenis = searchParams.get('jenis')?.split(',') || []
    const status = searchParams.get('status')?.split(',') || []

    // Price filters
    const hargaMin = searchParams.get('hargaMin') ? parseInt(searchParams.get('hargaMin')!) : undefined
    const hargaMax = searchParams.get('hargaMax') ? parseInt(searchParams.get('hargaMax')!) : undefined

    // Area filters
    const luasTanahMin = searchParams.get('luasTanahMin') ? parseInt(searchParams.get('luasTanahMin')!) : undefined
    const luasTanahMax = searchParams.get('luasTanahMax') ? parseInt(searchParams.get('luasTanahMax')!) : undefined
    const luasBangunanMin = searchParams.get('luasBangunanMin') ? parseInt(searchParams.get('luasBangunanMin')!) : undefined
    const luasBangunanMax = searchParams.get('luasBangunanMax') ? parseInt(searchParams.get('luasBangunanMax')!) : undefined

    // Room filters
    const kamarTidurMin = searchParams.get('kamarTidurMin') ? parseInt(searchParams.get('kamarTidurMin')!) : undefined
    const kamarMandiMin = searchParams.get('kamarMandiMin') ? parseInt(searchParams.get('kamarMandiMin')!) : undefined

    // Special filters
    const isPremium = searchParams.get('isPremium') === 'true'
    const isFeatured = searchParams.get('isFeatured') === 'true'
    const isHot = searchParams.get('isHot') === 'true'

    const offset = (page - 1) * limit

    // Try to fetch from database first
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)

      // Apply sorting
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'price_asc':
          query = query.order('harga_properti', { ascending: true })
          break
        case 'price_desc':
          query = query.order('harga_properti', { ascending: false })
          break
        case 'area_asc':
          query = query.order('luas_tanah', { ascending: true })
          break
        case 'area_desc':
          query = query.order('luas_tanah', { ascending: false })
          break
        case 'popular':
          query = query.order('created_at', { ascending: false }) // Fallback to newest
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Apply search filter
      if (search) {
        query = query.or(`judul_properti.ilike.%${search}%,deskripsi.ilike.%${search}%,alamat_lengkap.ilike.%${search}%`)
      }

      // Apply location filters
      if (provinsi) {
        query = query.ilike('provinsi', `%${provinsi}%`)
      }
      if (kabupaten) {
        query = query.ilike('kabupaten', `%${kabupaten}%`)
      }
      if (kecamatan) {
        query = query.ilike('kecamatan', `%${kecamatan}%`)
      }
      if (kelurahan) {
        query = query.ilike('kelurahan', `%${kelurahan}%`)
      }

      // Apply property type filters
      if (jenis.length > 0) {
        query = query.in('jenis_properti', jenis)
      }

      // Apply status filters
      if (status.length > 0) {
        query = query.in('status', status)
      }

      // Apply price filters
      if (hargaMin !== undefined) {
        query = query.gte('harga_properti', hargaMin)
      }
      if (hargaMax !== undefined) {
        query = query.lte('harga_properti', hargaMax)
      }

      // Apply area filters
      if (luasTanahMin !== undefined) {
        query = query.gte('luas_tanah', luasTanahMin)
      }
      if (luasTanahMax !== undefined) {
        query = query.lte('luas_tanah', luasTanahMax)
      }
      if (luasBangunanMin !== undefined) {
        query = query.gte('luas_bangunan', luasBangunanMin)
      }
      if (luasBangunanMax !== undefined) {
        query = query.lte('luas_bangunan', luasBangunanMax)
      }

      // Apply room filters
      if (kamarTidurMin !== undefined) {
        query = query.gte('kamar_tidur', kamarTidurMin)
      }
      if (kamarMandiMin !== undefined) {
        query = query.gte('kamar_mandi', kamarMandiMin)
      }

      // Apply special filters
      if (isPremium) {
        query = query.eq('is_premium', true)
      }
      if (isFeatured) {
        query = query.eq('is_featured', true)
      }
      if (isHot) {
        query = query.eq('is_hot', true)
      }

      const { data: propertiesList, error, count } = await query

      if (!error && propertiesList && propertiesList.length > 0) {
        const total = count || 0
        const totalPages = Math.ceil(total / limit)

        return NextResponse.json({
          properties: (propertiesList || []).map(transformDbProperty),
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        })
      }
    } catch (dbError) {
      console.warn('Database query failed, falling back to mock data:', (dbError as Error).message)
    }

    // Fallback to mock data
    console.log('Using mock data for properties list')
    const mockProperties = getMockProperties()

    // Apply filters to mock data
    let filteredProperties = mockProperties

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProperties = filteredProperties.filter(p =>
        p.judul_properti?.toLowerCase().includes(searchLower) ||
        p.deskripsi?.toLowerCase().includes(searchLower) ||
        p.alamat_lengkap?.toLowerCase().includes(searchLower)
      )
    }

    // Apply location filters
    if (provinsi) {
      filteredProperties = filteredProperties.filter(p =>
        p.provinsi?.toLowerCase().includes(provinsi.toLowerCase())
      )
    }
    if (kabupaten) {
      filteredProperties = filteredProperties.filter(p =>
        p.kabupaten?.toLowerCase().includes(kabupaten.toLowerCase())
      )
    }
    if (kecamatan) {
      filteredProperties = filteredProperties.filter(p =>
        p.kecamatan?.toLowerCase().includes(kecamatan.toLowerCase())
      )
    }
    if (kelurahan) {
      filteredProperties = filteredProperties.filter(p =>
        p.kelurahan?.toLowerCase().includes(kelurahan.toLowerCase())
      )
    }

    // Apply property type filters
    if (jenis.length > 0) {
      filteredProperties = filteredProperties.filter(p => jenis.includes(p.jenis_properti))
    }

    // Apply status filters
    if (status.length > 0) {
      filteredProperties = filteredProperties.filter(p => status.includes(p.status))
    }

    // Apply price filters
    if (hargaMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.harga_properti >= hargaMin)
    }
    if (hargaMax !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.harga_properti <= hargaMax)
    }

    // Apply area filters
    if (luasTanahMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.luas_tanah || 0) >= luasTanahMin)
    }
    if (luasTanahMax !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.luas_tanah || 0) <= luasTanahMax)
    }
    if (luasBangunanMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.luas_bangunan || 0) >= luasBangunanMin)
    }
    if (luasBangunanMax !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.luas_bangunan || 0) <= luasBangunanMax)
    }

    // Apply room filters
    if (kamarTidurMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.kamar_tidur || 0) >= kamarTidurMin)
    }
    if (kamarMandiMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => (p.kamar_mandi || 0) >= kamarMandiMin)
    }

    // Apply special filters
    if (isPremium) {
      filteredProperties = filteredProperties.filter(p => p.is_premium)
    }
    if (isFeatured) {
      filteredProperties = filteredProperties.filter(p => p.is_featured)
    }
    if (isHot) {
      filteredProperties = filteredProperties.filter(p => p.is_hot)
    }

    // Apply sorting to mock data
    filteredProperties.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'price_asc':
          return a.harga_properti - b.harga_properti
        case 'price_desc':
          return b.harga_properti - a.harga_properti
        case 'area_asc':
          return (a.luas_tanah || 0) - (b.luas_tanah || 0)
        case 'area_desc':
          return (b.luas_tanah || 0) - (a.luas_tanah || 0)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    // Apply pagination to mock data
    const total = filteredProperties.length
    const totalPages = Math.ceil(total / limit)
    const paginatedProperties = filteredProperties.slice(offset, offset + limit)

    return NextResponse.json({
      properties: paginatedProperties.map(transformDbProperty),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)

    // Final fallback to mock data
    const mockProperties = getMockProperties()
    const total = mockProperties.length
    const totalPages = Math.ceil(total / 12)

    return NextResponse.json({
      properties: mockProperties.slice(0, 12).map(transformDbProperty),
      pagination: {
        page: 1,
        limit: 12,
        total,
        totalPages,
        hasNext: 1 < totalPages,
        hasPrev: false
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newProperty = await db
      .insert(properties)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return NextResponse.json(newProperty[0], { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}