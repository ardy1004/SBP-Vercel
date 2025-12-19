export interface Property {
  id: string;
  kodeListing: string;
  judulProperti?: string;
  deskripsi?: string;
  metaTitle?: string;
  metaDescription?: string;
  jenisProperti: PropertyType;
  luasTanah?: number;
  luasBangunan?: number;
  kamarTidur?: number;
  kamarMandi?: number;
  legalitas?: LegalStatus;
  hargaProperti: number;
  hargaPerMeter?: boolean;
  provinsi: string;
  kabupaten: string;
  kecamatan?: string;
  kelurahan?: string;
  kecamatanId?: number;
  kelurahanId?: number;
  alamatLengkap?: string;
  imageUrl: string;
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
  isPremium: boolean;
  isFeatured: boolean;
  isHot: boolean;
  isSold: boolean;
  priceOld?: number;
  isPropertyPilihan: boolean;
  ownerContact?: string;
  status: PropertyStatus;
  fts?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType =
  | "apartment"
  | "gudang"
  | "villa"
  | "homestay_guesthouse"
  | "hotel"
  | "kost"
  | "rumah"
  | "ruko"
  | "tanah"
  | "bangunan_komersial";

export type PropertyStatus = "dijual" | "disewakan";

export type LegalStatus =
  | "SHM"
  | "SHGB"
  | "PPJB"
  | "Girik"
  | "Letter C"
  | "SHM & PBG"
  | "SHGB & PBG";