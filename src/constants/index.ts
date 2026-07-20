import type { NavItem, Category } from '@/types';

export const APP_NAME = 'LuxeMarket';
export const APP_TAGLINE = 'Premium Shopping Experience';
export const APP_TAGLINE_AR = 'تجربة تسوق فاخرة';

export const WHATSAPP_BASE_URL = 'https://wa.me';
export const CONTACT_EMAIL =  "mahmodcom034@gmail.com"
export const CONTACT_PHONE = '01121638405';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', labelAr: 'الرئيسية', href: '/' },
  { label: 'products', labelAr: 'المنتجات', href: '/shop' },
  { label: 'Wishlist', labelAr: 'المفضلة', href: '/wishlist' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    nameAr: 'إلكترونيات',
    description: 'Latest gadgets and electronic devices',
    descriptionAr: 'أحدث الأجهزة والإلكترونيات',
    icon: 'Laptop',
    productCount: 0,
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    nameAr: 'أزياء',
    description: 'Trendy clothing and accessories',
    descriptionAr: 'ملابس وإكسسوارات عصرية',
    icon: 'Shirt',
    productCount: 0,
    color: 'from-purple-500/20 to-purple-600/10',
  },
  {
    id: 'home',
    name: 'Home & Living',
    nameAr: 'المنزل والمعيشة',
    description: 'Beautiful home decor and furniture',
    descriptionAr: 'ديكور وأثاث منزل رائع',
    icon: 'Home',
    productCount: 0,
    color: 'from-amber-500/20 to-amber-600/10',
  },
  {
    id: 'sports',
    name: 'Sports',
    nameAr: 'رياضة',
    description: 'Sports equipment and gear',
    descriptionAr: 'معدات ولوازم رياضية',
    icon: 'Dumbbell',
    productCount: 0,
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    nameAr: 'جمال',
    description: 'Premium beauty and skincare products',
    descriptionAr: 'منتجات تجميل وعناية بالبشرة فاخرة',
    icon: 'Sparkles',
    productCount: 0,
    color: 'from-rose-500/20 to-rose-600/10',
  },
  {
    id: 'books',
    name: 'Books',
    nameAr: 'كتب',
    description: 'Books across all genres',
    descriptionAr: 'كتب من جميع الأنواع',
    icon: 'BookOpen',
    productCount: 0,
    color: 'from-teal-500/20 to-teal-600/10',
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', labelAr: 'الأحدث' },
  { value: 'price-asc', label: 'Price: Low to High', labelAr: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'Price: High to Low', labelAr: 'السعر: من الأعلى للأقل' },
  { value: 'name-asc', label: 'Name: A-Z', labelAr: 'الاسم: أ-ي' },
  { value: 'name-desc', label: 'Name: Z-A', labelAr: 'الاسم: ي-أ' },
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under $50', labelAr: 'أقل من 50$' },
  { min: 50, max: 100, label: '$50 - $100', labelAr: '50$ - 100$' },
  { min: 100, max: 200, label: '$100 - $200', labelAr: '100$ - 200$' },
  { min: 200, max: 500, label: '$200 - $500', labelAr: '200$ - 500$' },
  { min: 500, max: Infinity, label: 'Over $500', labelAr: 'أكثر من 500$' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/luxemarket',
  instagram: 'https://instagram.com/luxemarket',
  twitter: 'https://twitter.com/luxemarket',
  whatsapp: 'https://wa.me/966501234567',
};

export const VIEW_MODES = ['grid', 'list'] as const;
export type ViewMode = (typeof VIEW_MODES)[number];
