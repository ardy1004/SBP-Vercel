'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SearchState, AdvancedSearchFilters, SortOption } from '@/types/search'

interface SearchStore extends SearchState {
  // Actions
  setQuery: (query: string) => void
  setFilters: (filters: Partial<AdvancedSearchFilters>) => void
  updateFilter: (key: keyof AdvancedSearchFilters, value: any) => void
  clearFilters: () => void
  setSortBy: (sortBy: SortOption) => void
  setViewMode: (viewMode: 'grid' | 'list' | 'map') => void
  resetSearch: () => void

  // Computed
  hasActiveFilters: boolean
  activeFilterCount: number
}

const initialFilters: AdvancedSearchFilters = {}

const initialState: SearchState = {
  query: '',
  filters: initialFilters,
  sortBy: 'newest',
  viewMode: 'grid'
}

export const useSearchStore = create<SearchStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setQuery: (query) => set({ query }, false, 'setQuery'),

      setFilters: (filters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filters }
          }),
          false,
          'setFilters'
        ),

      updateFilter: (key, value) =>
        set(
          (state) => ({
            filters: { ...state.filters, [key]: value }
          }),
          false,
          'updateFilter'
        ),

      clearFilters: () =>
        set(
          { filters: {} },
          false,
          'clearFilters'
        ),

      setSortBy: (sortBy) => set({ sortBy }, false, 'setSortBy'),

      setViewMode: (viewMode) => set({ viewMode }, false, 'setViewMode'),

      resetSearch: () =>
        set(
          { ...initialState },
          false,
          'resetSearch'
        ),

      get hasActiveFilters() {
        const filters = get().filters
        return Object.values(filters).some(value =>
          value !== undefined && value !== null && value !== '' &&
          (Array.isArray(value) ? value.length > 0 : true)
        )
      },

      get activeFilterCount() {
        const filters = get().filters
        return Object.values(filters).filter(value =>
          value !== undefined && value !== null && value !== '' &&
          (Array.isArray(value) ? value.length > 0 : true)
        ).length
      }
    }),
    {
      name: 'search-store'
    }
  )
)