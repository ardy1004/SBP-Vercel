import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PropertyStore {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  clearFavorites: () => void;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (propertyId: string) => {
        const { favorites } = get();
        const isCurrentlyFavorite = favorites.includes(propertyId);

        if (isCurrentlyFavorite) {
          set({
            favorites: favorites.filter(id => id !== propertyId)
          });
        } else {
          set({
            favorites: [...favorites, propertyId]
          });
        }
      },

      isFavorite: (propertyId: string) => {
        return get().favorites.includes(propertyId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'property-store',
    }
  )
);