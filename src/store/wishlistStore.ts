import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number | string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: number | string | undefined) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (!exists) {
          set((state) => ({
            items: [...state.items, { product, addedAt: new Date().toISOString() }],
          }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          // eslint-disable-next-line eqeqeq
          items: state.items.filter((item) => item.product.id != productId),
        }));
      },
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        if (exists) {
          get().removeItem(product.id as number | string);
        } else {
          get().addItem(product);
        }
      },
      isInWishlist: (productId) => {
        if (productId === undefined) return false;
        return get().items.some((item) => item.product.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
      getCount: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
