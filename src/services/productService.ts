import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/constants';
import type { Product, Category } from '@/types';

// ─── Filter / Pagination interfaces ────────────────────────────────────────

export interface ProductFilters {
  category?: string | null;
  searchQuery?: string;
  priceRange?: [number, number];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name-asc' | 'name-desc';
  featured?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Column normalizer ──────────────────────────────────────────────────────
// Supabase returns raw DB column names. This mapper normalises any variation
// of column naming (snake_case, different casing) into the Product interface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(raw: Record<string, any>): Product {
  // Resolve primary image: prefer images[0] if array exists, else image field
  const imagesArray: string[] = Array.isArray(raw.images)
    ? raw.images
    : raw.image
    ? [raw.image]
    : [];

  return {
    id:              raw.id,
    title:           raw.title           ?? raw.Title          ?? '',
    titleAr:         raw.titleAr         ?? raw.titleAR        ?? raw.title_ar       ?? '',
    description:     raw.description     ?? raw.Description    ?? raw.desc            ?? '',
    descriptionAr:   raw.descriptionAr   ?? raw.descriptionAR  ?? raw.description_ar  ?? raw.descAr ?? '',
    price:           Number(raw.price    ?? raw.Price          ?? 0),
    discount:        raw.discount        != null ? Number(raw.discount)        : undefined,
    category:        raw.category        ?? raw.Category       ?? '',
    categoryAr:      raw.categoryAr      ?? raw.categoryAR     ?? raw.category_ar     ?? '',
    featured:        Boolean(raw.featured ?? raw.Featured ?? false),
    // Primary image: first item in images array, or standalone image field
    image:           imagesArray[0]      ?? raw.image          ?? '',
    images:          imagesArray.length  ? imagesArray         : undefined,
    // whatsNumber is the actual column name in this project's Supabase table
    whatsappNumber:  raw.whatsappNumber  ?? raw.whatsNumber    ?? raw.whatsapp_number ?? raw.phone ?? '',
    createdAt:       raw.createdAt       ?? raw.created_at     ?? undefined,
    rating:          Number(raw.rating   ?? raw.Rating         ?? 0),
    reviews:         Number(raw.reviews  ?? raw.Reviews        ?? 0),
    inStock:         raw.inStock         != null ? Boolean(raw.inStock)
                   : raw.in_stock        != null ? Boolean(raw.in_stock)
                   : true,
    sku:             raw.sku             ?? raw.Sku             ?? raw.SKU            ?? '',
    tags:            Array.isArray(raw.tags) ? raw.tags
                   : typeof raw.tags === 'string' ? raw.tags.split(',').map((t: string) => t.trim())
                   : [],
  };
}

// ─── CRUD helpers ───────────────────────────────────────────────────────────

/** Fetch all products, with optional filters applied in-memory after fetching. */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase.from('Products').select('*');

  // Only apply featured server-side (boolean, no casing issue)
  if (filters?.featured) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getProducts] Supabase error:', error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: Product[] = ((data ?? []) as Record<string, any>[]).map(normalizeProduct);

  // Category filter — case-insensitive client-side comparison
  // Handles mismatches like 'fashion' (filter id) vs 'Fashion' (DB value)
  if (filters?.category) {
    const catLower = filters.category.toLowerCase();
    result = result.filter(
      (p) =>
        p.category.toLowerCase() === catLower ||
        p.categoryAr === filters.category
    );
  }

  // Full-text search — client-side across all text fields
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionAr.includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryAr.includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Price range filter — only apply when range has been narrowed from defaults
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    // Skip filter if at full default range [0, Infinity] or [0, 1000] untouched
    const isDefaultRange = min === 0 && (max === 1000 || max === Infinity);
    if (!isDefaultRange) {
      result = result.filter((p) => p.price >= min && p.price <= max);
    }
  }

  // Sorting
  if (filters?.sortBy) {
    result = sortProducts(result, filters.sortBy);
  }

  return result;
}

/** Fetch a single product by its numeric id. */
export async function getProductById(id: string | number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    console.error('[getProductById] Supabase error:', error.message);
    return null;
  }

  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return normalizeProduct(data as Record<string, any>);
}

/** Fetch only featured products. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('featured', true);

  if (error) {
    console.error('[getFeaturedProducts] Supabase error:', error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as Record<string, any>[]).map(normalizeProduct);
}

/** Fetch products in the same category, excluding the current product. */
export async function getRelatedProducts(
  productId: string | number,
  limit: number = 4
): Promise<Product[]> {
  const { data: productData, error: productError } = await supabase
    .from('Products')
    .select('category')
    .eq('id', Number(productId))
    .single();

  if (productError || !productData) {
    console.error('[getRelatedProducts] Could not fetch source product:', productError?.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sourceCategory = (productData as Record<string, any>).category ?? '';

  const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('category', sourceCategory)
    .neq('id', Number(productId))
    .limit(limit);

  if (error) {
    console.error('[getRelatedProducts] Supabase error:', error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as Record<string, any>[]).map(normalizeProduct);
}

/** Paginated product fetch with filters. */
export async function getPaginatedProducts(
  page: number = 1,
  pageSize: number = 12,
  filters?: ProductFilters
): Promise<PaginatedResult<Product>> {
  const allProducts = await getProducts(filters);
  const total = allProducts.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = allProducts.slice(start, end);

  return { data, total, page, pageSize, totalPages };
}

/** Insert a new product row. */
export async function addProduct(
  product: Omit<Product, 'id' | 'createdAt'>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('Products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('[addProduct] Supabase error:', error.message);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data ? normalizeProduct(data as Record<string, any>) : null;
}

/** Update an existing product by id. */
export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('Products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateProduct] Supabase error:', error.message);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data ? normalizeProduct(data as Record<string, any>) : null;
}

/** Delete a product by id. Returns true on success. */
export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase.from('Products').delete().eq('id', id);

  if (error) {
    console.error('[deleteProduct] Supabase error:', error.message);
    return false;
  }

  return true;
}

// ─── Category helpers ──────────────────────────────────────────────────────

/** Static categories (kept for backward-compat with CategorySection on Home page) */
export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

/**
 * Dynamic category list derived from live product data.
 * - Deduplicates by case-insensitive category name
 * - Counts actual products per category
 * - Sorted by product count (highest first)
 */
export interface DynamicCategory {
  /** Lowercased category value — used as the filter key */
  id: string;
  /** Original category name from the DB (English) */
  name: string;
  /** Arabic category name from the DB */
  nameAr: string;
  /** Number of products in this category */
  count: number;
}

export async function getDynamicCategories(): Promise<DynamicCategory[]> {
  const products = await getProducts(); // fetch all, no filters

  // Build a map keyed by lowercased category name for deduplication
  const map = new Map<string, { name: string; nameAr: string; count: number }>();

  for (const p of products) {
    if (!p.category) continue;
    const key = p.category.toLowerCase().trim();
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } else {
      map.set(key, {
        name: p.category,
        nameAr: p.categoryAr || p.category,
        count: 1,
      });
    }
  }

  // Convert to sorted array (most products first)
  return Array.from(map.entries())
    .map(([id, { name, nameAr, count }]) => ({ id, name, nameAr, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Private sort helper ────────────────────────────────────────────────────

function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

// ─── Backwards-compatible class wrapper ────────────────────────────────────

class ProductService {
  getProducts = getProducts;
  getProductById = getProductById;
  getFeaturedProducts = getFeaturedProducts;
  getRelatedProducts = getRelatedProducts;
  getPaginatedProducts = getPaginatedProducts;
  getCategories = getCategories;
  getCategoryById = getCategoryById;
  getDynamicCategories = getDynamicCategories;
  addProduct = addProduct;
  updateProduct = updateProduct;
  deleteProduct = deleteProduct;
}

export const productService = new ProductService();
