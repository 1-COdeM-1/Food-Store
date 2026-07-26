// removed unused react imports
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
// removed unused product import

export function FeaturedSection() {
  const { t } = useTranslation('common');
  const { dir } = useLanguageStore();
  const navigate = useNavigate();
  const { data = [], isLoading: loading } = useFeaturedProducts();
  const products = data.slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t('featuredProducts.title')}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              {t('featuredProducts.description')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/shop')}
            className={cn(
              'self-start sm:self-auto rounded-xl',
              'hover:bg-primary hover:text-primary-foreground transition-all duration-200'
            )}
          >
            {t('viewAll')}
            <ArrowRight
              className={cn('w-4 h-4', dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')}
            />
          </Button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
