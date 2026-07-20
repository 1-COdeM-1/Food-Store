import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SortOption } from '@/types';

interface FilterState {
  category: string | null;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  setCategory: (category: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      category: null,
      priceRange: [0, Infinity],
      searchQuery: '',
      sortBy: 'newest',
      viewMode: 'grid',
      setCategory: (category) => set({ category }),
      setPriceRange: (priceRange) => set({ priceRange }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      setViewMode: (viewMode) => set({ viewMode }),
      clearFilters: () =>
        set({
          category: null,
          priceRange: [0, Infinity],
          searchQuery: '',
          sortBy: 'newest',
        }),
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        sortBy: state.sortBy,
        viewMode: state.viewMode,
      }),
    }
  )
);
