import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Debug environment variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Real property data from properties_inserts.sql
const realProperties = [
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
    image_url3: '',
    image_url4: '',
    image_url5: '',
    image_url6: '',
    image_url7: '',
    image_url8: '',
    image_url9: '',
    youtube_url: '',
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
    image_url5: '',
    image_url6: '',
    image_url7: '',
    image_url8: '',
    image_url9: '',
    youtube_url: '',
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
    image_url5: '',
    image_url6: '',
    image_url7: '',
    image_url8: '',
    image_url9: '',
    youtube_url: '',
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
    image_url5: '',
    image_url6: '',
    image_url7: '',
    image_url8: '',
    image_url9: '',
    youtube_url: '',
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
    image_url5: '',
    image_url6: '',
    image_url7: '',
    image_url8: '',
    image_url9: '',
    youtube_url: '',
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

async function importRealProperties() {
  try {
    console.log('🚀 Starting real property data import...')
    console.log(`📊 Importing ${realProperties.length} properties...`)

    for (const property of realProperties) {
      console.log(`📝 Importing property: ${property.kode_listing} - ${property.judul_properti}`)

      const { error } = await supabase
        .from('properties')
        .upsert(property, { onConflict: 'id' })

      if (error) {
        console.error(`❌ Error importing ${property.kode_listing}:`, error.message)
      } else {
        console.log(`✅ Successfully imported ${property.kode_listing}`)
      }
    }

    console.log('🎉 Real property data import completed!')
    console.log('💡 Homepage will now display real property data instead of mock data.')

  } catch (error) {
    console.error('❌ Import failed:', error.message)
  }
}

// Run the import
importRealProperties()