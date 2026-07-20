export interface Product {
  id?: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  discount?: number;
  category: string;
  categoryAr: string;
  featured: boolean;
  image: string;
  images?: string[];
  whatsappNumber: string;
  createdAt?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  productCount: number;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface FilterState {
  category: string | null;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: SortOption;
}

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'newest' 
  | 'name-asc' 
  | 'name-desc';

export type Theme = 'light' | 'dark' | 'system';

export type Language = 'en' | 'ar';




export interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon?: string;
}

export interface SEOProps {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  keywords?: string;
  keywordsAr?: string;
}
