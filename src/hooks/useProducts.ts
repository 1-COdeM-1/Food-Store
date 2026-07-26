import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllProducts,
  fetchProductById,
  filterProducts,
  deriveDynamicCategories,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
  type ProductFilters
} from '@/services/productService';
import type { Product } from '@/types';

// The single source of truth query for all products
export const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchAllProducts,
    select: (data) => filterProducts(data, filters),
  });
}

export function useProductById(id: string | number | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required');
      return fetchProductById(id);
    },
    enabled: !!id,
  });
}

export function useDynamicCategories() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchAllProducts,
    select: (data) => deriveDynamicCategories(data),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchAllProducts,
    select: (data) => filterProducts(data, { featured: true }),
  });
}

export function useRelatedProducts(id: string | number | undefined, limit: number = 4) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchAllProducts,
    select: (data) => {
      if (!id) return [];
      const numId = Number(id);
      const source = data.find((p) => p.id === numId);
      if (!source) return [];
      return data
        .filter((p) => p.id !== numId && p.category === source.category)
        .slice(0, limit);
    },
    enabled: !!id,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProductToDB,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Omit<Product, 'id' | 'createdAt'>> }) =>
      updateProductInDB(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductFromDB,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}
