import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { useLanguageStore } from '@/store/languageStore';
import { useFilterStore } from '@/store/filterStore';
import { SORT_OPTIONS } from '@/constants';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';
import type { Product, SortOption } from '@/types';
import type { DynamicCategory } from '@/services/productService';

const PAGE_SIZE = 12;

export function ShopPage() {
  const { t } = useTranslation('common');
  const { language } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const {
    category,
    priceRange,
    searchQuery,
    sortBy,
    viewMode,
    setCategory,
    setPriceRange,
    setSearchQuery,
    setSortBy,
    setViewMode,
    clearFilters,
  } = useFilterStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<DynamicCategory[]>([]);

  // Sync URL category param with store
  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam, setCategory]);

  // Load dynamic categories from live product data
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await productService.getDynamicCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productService.getPaginatedProducts(page, PAGE_SIZE, {
        category,
        searchQuery: searchQuery || undefined,
        priceRange,
        sortBy,
      });
      setProducts(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, category, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Keep a stable ref to loadProducts so the realtime callback
  // always calls the latest version without re-subscribing
  const loadProductsRef = useRef(loadProducts);
  useEffect(() => {
    loadProductsRef.current = loadProducts;
  }, [loadProducts]);

  // Subscribe to live DB changes – fires INSERT / UPDATE / DELETE events
  // without needing a page refresh. The `onAnyChange` callback also re-runs
  // the full query so pagination totals stay accurate.
  useRealtimeProducts({
    setProducts,
    enabled: !loading,
    onAnyChange: () => void loadProductsRef.current(),
  });

  const totalPages = useMemo(() => Math.ceil(total / PAGE_SIZE), [total]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category) count++;
    if (searchQuery) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    return count;
  }, [category, searchQuery, priceRange]);

  const handleClearFilters = () => {
    clearFilters();
    setSearchParams({});
    setPage(1);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
          {t('categories')}
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => {
              setCategory(null);
              setSearchParams({});
              setPage(1);
            }}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
              !category
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            {t('all')} ({categories.reduce((acc, c) => acc + c.count, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setPage(1);
              }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                category === cat.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              {language === 'ar' ? cat.nameAr : cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
          {t('priceRange')}
        </h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value as [number, number]);
              setPage(1);
            }}
            max={1000}
            step={10}
            className="py-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          {t('clearFilters')} ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('shop')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total} {t('products')}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden h-10"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t('filters')}
              {activeFiltersCount > 0 && (
                <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {language === 'ar' ? option.labelAr : option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-input rounded-xl overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="lg:hidden mb-6 p-4 rounded-xl border border-border bg-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('filters')}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <FilterContent />
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 p-5 rounded-2xl border border-border bg-card">
              <h2 className="text-lg font-semibold text-foreground mb-5">
                {t('filters')}
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSkeleton count={PAGE_SIZE} />
            ) : products.length === 0 ? (
              <EmptyState
                variant="search"
                actionLabel={t('clearFilters')}
                onAction={handleClearFilters}
              />
            ) : (
              <>
                <div
                  className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                      : 'flex flex-col gap-4'
                  )}
                >
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={total}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
