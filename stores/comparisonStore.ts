'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Property } from '@/types'

interface ComparisonField {
  key: keyof Property
  label: string
  format: 'currency' | 'area' | 'text' | 'number' | 'boolean' | 'date'
  priority: 'high' | 'medium' | 'low'
}

interface ComparisonState {
  selectedProperties: Property[]
  maxComparisons: number
  isModalOpen: boolean
  comparisonFields: ComparisonField[]
}

interface ComparisonStore extends ComparisonState {
  // Actions
  addProperty: (property: Property) => void
  removeProperty: (propertyId: string) => void
  clearComparison: () => void
  toggleModal: () => void
  setModalOpen: (open: boolean) => void

  // Computed
  canAddMore: boolean
  isInComparison: (propertyId: string) => boolean
}

const DEFAULT_COMPARISON_FIELDS: ComparisonField[] = [
  { key: 'judulProperti', label: 'Judul', format: 'text', priority: 'high' },
  { key: 'hargaProperti', label: 'Harga', format: 'currency', priority: 'high' },
  { key: 'jenisProperti', label: 'Tipe', format: 'text', priority: 'high' },
  { key: 'luasTanah', label: 'Luas Tanah', format: 'area', priority: 'high' },
  { key: 'luasBangunan', label: 'Luas Bangunan', format: 'area', priority: 'high' },
  { key: 'kamarTidur', label: 'Kamar Tidur', format: 'number', priority: 'high' },
  { key: 'kamarMandi', label: 'Kamar Mandi', format: 'number', priority: 'high' },
  { key: 'kabupaten', label: 'Lokasi', format: 'text', priority: 'medium' },
  { key: 'legalitas', label: 'Legalitas', format: 'text', priority: 'medium' },
  { key: 'isPremium', label: 'Premium', format: 'boolean', priority: 'medium' },
  { key: 'isHot', label: 'Hot Deal', format: 'boolean', priority: 'medium' },
  { key: 'isFeatured', label: 'Featured', format: 'boolean', priority: 'medium' },
  { key: 'createdAt', label: 'Dibuat', format: 'date', priority: 'low' }
]

const initialState: ComparisonState = {
  selectedProperties: [],
  maxComparisons: 4,
  isModalOpen: false,
  comparisonFields: DEFAULT_COMPARISON_FIELDS
}

export const useComparisonStore = create<ComparisonStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addProperty: (property) =>
        set((state) => {
          if (state.selectedProperties.length >= state.maxComparisons) {
            return state // Max reached
          }
          if (state.selectedProperties.find(p => p.id === property.id)) {
            return state // Already added
          }
          return {
            selectedProperties: [...state.selectedProperties, property]
          }
        }, false, 'addProperty'),

      removeProperty: (propertyId) =>
        set((state) => ({
          selectedProperties: state.selectedProperties.filter(p => p.id !== propertyId)
        }), false, 'removeProperty'),

      clearComparison: () =>
        set(
          { selectedProperties: [] },
          false,
          'clearComparison'
        ),

      toggleModal: () =>
        set((state) => ({
          isModalOpen: !state.isModalOpen
        }), false, 'toggleModal'),

      setModalOpen: (open) =>
        set({ isModalOpen: open }, false, 'setModalOpen'),

      get canAddMore() {
        return get().selectedProperties.length < get().maxComparisons
      },

      isInComparison: (propertyId) => {
        return get().selectedProperties.some(p => p.id === propertyId)
      }
    }),
    {
      name: 'comparison-store'
    }
  )
)