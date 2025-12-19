import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API called for property ID:', id)

    // Try to fetch from database first
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && property) {
        console.log('Found property in database:', property.kode_listing)
        return NextResponse.json(transformDbProperty(property))
      }
    } catch (dbError) {
      console.warn('Database query failed, falling back to mock data:', (dbError as Error).message)
    }

    // Fallback to mock data
    console.log('Using mock data for property:', id)
    const mockProperties = getMockProperties()
    const mockProperty = mockProperties.find(p => p.id === id)

    if (mockProperty) {
      console.log('Found mock property:', mockProperty.kode_listing)
      return NextResponse.json(transformDbProperty(mockProperty))
    }

    console.log('Property not found for ID:', id)
    return NextResponse.json(
      { error: 'Property not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !updatedProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transformDbProperty(updatedProperty))
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}