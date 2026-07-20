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
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';
import type { Product, SortOption } from '@/types';
import type { DynamicCategory } from '@/services/productService';

const PAGE_SIZE = 12;

interface FilterContentProps {
  t: (key: string) => string;
  language: string;
  categories: DynamicCategory[];
  category: string | null;
  draftMin: number;
  draftMax: string;
  activeFiltersCount: number;
  setCategory: (cat: string | null) => void;
  setSearchParams: (params: Record<string, string>) => void;
  setPage: (page: number) => void;
  setDraftMin: (val: number) => void;
  setDraftMax: (val: string) => void;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
}

function FilterContent({
  t,
  language,
  categories,
  category,
  draftMin,
  draftMax,
  activeFiltersCount,
  setCategory,
  setSearchParams,
  setPage,
  setDraftMin,
  setDraftMax,
  handleApplyFilters,
  handleClearFilters,
}: FilterContentProps) {
  return (
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
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">{t('min')}</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                min={0}
                value={draftMin}
                onChange={(e) => setDraftMin(Number(e.target.value))}
                className="pl-6 h-9 text-sm"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">{t('max')}</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                min={0}
                value={draftMax}
                onChange={(e) => setDraftMax(e.target.value)}
                className="pl-6 h-9 text-sm"
                placeholder={t('max')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleApplyFilters}
        >
          <Search className="w-4 h-4 mr-2" />
          {t('search')}
        </Button>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearFilters}
          >
            <X className="w-4 h-4 mr-2" />
            {t('clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}

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

  // Local draft state for price inputs — decoupled from the filter store
  const [draftMin, setDraftMin] = useState<number>(priceRange[0]);
  // Empty string means "no upper limit" (Infinity)
  const [draftMax, setDraftMax] = useState<string>(
    priceRange[1] === Infinity ? '' : String(priceRange[1])
  );

  // Apply price draft to store only when user clicks Search
  const handleApplyFilters = () => {
    const min = Math.max(0, draftMin);
    const max = draftMax === '' ? Infinity : Math.max(min, Number(draftMax));
    setPriceRange([min, max]);
    setPage(1);
  };

  // Sync draft back when priceRange is reset externally (e.g. Clear Filters)
  useEffect(() => {
    setDraftMin(priceRange[0]);
    setDraftMax(priceRange[1] === Infinity ? '' : String(priceRange[1]));
  }, [priceRange[0], priceRange[1]]);

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
    if (priceRange[0] > 0 || priceRange[1] < Infinity) count++;
    return count;
  }, [category, searchQuery, priceRange]);

  const handleClearFilters = () => {
    clearFilters();
    setSearchParams({});
    setPage(1);
  };



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
            <FilterContent
                t={t}
                language={language}
                categories={categories}
                category={category}
                draftMin={draftMin}
                draftMax={draftMax}
                activeFiltersCount={activeFiltersCount}
                setCategory={setCategory}
                setSearchParams={(p) => setSearchParams(p)}
                setPage={setPage}
                setDraftMin={setDraftMin}
                setDraftMax={setDraftMax}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
              />
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
              <FilterContent
                t={t}
                language={language}
                categories={categories}
                category={category}
                draftMin={draftMin}
                draftMax={draftMax}
                activeFiltersCount={activeFiltersCount}
                setCategory={setCategory}
                setSearchParams={(p) => setSearchParams(p)}
                setPage={setPage}
                setDraftMin={setDraftMin}
                setDraftMax={setDraftMax}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
              />
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
