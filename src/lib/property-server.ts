import { supabase } from './supabase';
import type { Property } from '@shared/types';

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  // Parse slug to get search criteria
  const slugInfo = parsePropertySlug(slug);

  if (!slugInfo) return null;

  console.log('🔍 Server: Searching for property with slug info:', slugInfo);

  // First try exact match by kode_listing if available (most accurate)
  if (slugInfo.kode_listing) {
    console.log('🔍 Server: Searching by kode_listing:', slugInfo.kode_listing);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('kode_listing', slugInfo.kode_listing)
      .limit(1);

    if (!error && data && data.length > 0) {
      console.log('✅ Server: Found property by kode_listing:', data[0].id);
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
    console.error('❌ Server: Supabase query error:', error);
  }

  // If we found a property with exact match, return it
  if (data && data.length > 0) {
    console.log('✅ Server: Found property with exact match:', data[0].id);
    return transformSupabaseProperty(data[0]);
  }

  // Try fallback search by combining multiple criteria
  console.log('🔄 Server: No exact match, trying fallback search...');
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
    console.error('❌ Server: Fallback query also failed:', fallbackError);
    return null;
  }

  // Find best match from fallback results
  const bestMatch = fallbackData?.find(p =>
    p.status === slugInfo.status &&
    p.jenis_properti === slugInfo.jenis_properti
  ) || fallbackData?.[0];

  if (bestMatch) {
    console.log('✅ Server: Found property via fallback:', bestMatch.id);
    return transformSupabaseProperty(bestMatch);
  }

  console.log('❌ Server: No property found with any search method');
  return null;
}

function parsePropertySlug(slug: string) {
  const parts = slug.split('-');

  // Try to identify kode_listing (more flexible patterns: K2.60, R1.25, A123, etc)
  let kodeListingIndex = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i].toUpperCase();
    // More flexible regex to match various kode_listing patterns
    if (/^[A-Z]+\d+[\.\d]*$/.test(part) || /^\d+[A-Z]+\d*$/.test(part)) {
      kodeListingIndex = i;
      break;
    }
  }

  if (kodeListingIndex === -1) {
    // Fallback: assume last part is kode_listing
    kodeListingIndex = parts.length - 1;
  }

  const kode_listing = parts[kodeListingIndex]?.toUpperCase();

  // Extract other parts based on position
  const status = parts[0];
  const jenis_properti = parts[1];

  // Reconstruct location parts (provinsi-kabupaten might be combined)
  let provinsi = '';
  let kabupaten = '';
  let judulStartIndex = 2;

  if (parts.length > kodeListingIndex) {
    // Try to identify location parts
    const locationParts = parts.slice(2, kodeListingIndex);

    // Common province names in Indonesia (more comprehensive)
    const provinces = ['diyogyakarta', 'jakarta', 'jabar', 'jateng', 'jatim', 'bali', 'sumatera', 'sulawesi', 'kalimantan', 'papua', 'banten', 'lampung', 'riau', 'jambi'];

    for (let i = 0; i < locationParts.length; i++) {
      if (provinces.some(p => locationParts[i].includes(p))) {
        provinsi = locationParts[i];
        kabupaten = locationParts[i + 1] || '';
        judulStartIndex = 2 + i + (kabupaten ? 1 : 0) + 1;
        break;
      }
    }

    // If no province found, assume first two are location
    if (!provinsi && locationParts.length >= 2) {
      provinsi = locationParts[0];
      kabupaten = locationParts[1];
      judulStartIndex = 4;
    } else if (!provinsi && locationParts.length === 1) {
      provinsi = locationParts[0];
      judulStartIndex = 3;
    }
  }

  // Reconstruct title from remaining parts
  const titleParts = parts.slice(judulStartIndex, kodeListingIndex);
  const judul_properti = titleParts.join(' ').replace(/-/g, ' ');

  return {
    status,
    jenis_properti,
    provinsi,
    kabupaten,
    judul_properti,
    kode_listing
  };
}

function transformSupabaseProperty(supabaseProperty: any): Property {
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
}