export interface PriceRange {
  min: number
  max: number
}

export interface AreaRange {
  min: number
  max: number
}

export interface AdvancedSearchFilters {
  // Location filters
  provinsi?: string
  kabupaten?: string
  kecamatan?: string
  kelurahan?: string

  // Property type filters
  jenisProperti?: string[]

  // Price filters
  hargaMin?: number
  hargaMax?: number

  // Area filters
  luasTanahMin?: number
  luasTanahMax?: number
  luasBangunanMin?: number
  luasBangunanMax?: number

  // Room filters
  kamarTidurMin?: number
  kamarMandiMin?: number

  // Status filters
  status?: string[]

  // Special features
  isPremium?: boolean
  isFeatured?: boolean
  isHot?: boolean

  // Facilities (future use)
  facilities?: string[]
}

export interface SearchState {
  query: string
  filters: AdvancedSearchFilters
  sortBy: SortOption
  viewMode: 'grid' | 'list' | 'map'
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'area_asc'
  | 'area_desc'
  | 'popular'

export interface SearchResult {
  properties: any[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  searchTime: number
  appliedFilters: AdvancedSearchFilters
}