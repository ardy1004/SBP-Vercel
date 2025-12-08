export interface Property {
  id: string;
  kodeListing?: string;
  judulProperti?: string;
  deskripsi?: string;
  jenisProperti: string;
  luasTanah?: string;
  luasBangunan?: string;
  kamarTidur?: number;
  kamarMandi?: number;
  legalitas?: string;
  hargaProperti?: string;
  hargaPerMeter?: boolean;
  provinsi?: string;
  kabupaten?: string;
  alamatLengkap?: string;
  imageUrl?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  imageUrl6?: string;
  imageUrl7?: string;
  imageUrl8?: string;
  imageUrl9?: string;
  youtubeUrl?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
  isSold?: boolean;
  priceOld?: string;
  isPropertyPilihan?: boolean;
  ownerContact?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  shgb?: string;
  pbg?: string;
}

// Property Types
export const PROPERTY_TYPES = [
  'rumah',
  'kost',
  'apartment',
  'villa',
  'ruko',
  'tanah',
  'gudang',
  'hotel',
  'guesthouse'
] as const;

// Property Statuses
export const PROPERTY_STATUSES = [
  'dijual',
  'disewakan'
] as const;

// Legal Statuses
export const LEGAL_STATUSES = [
  'SHM',
  'SHGB',
  'HGB',
  'Girik',
  'PPJB',
  'AJB',
  'Lainnya'
] as const;