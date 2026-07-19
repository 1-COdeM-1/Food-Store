import { useTranslation } from 'react-i18next';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/shared/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WishlistPage() {
  const { t } = useTranslation('common');
  const { items, clearWishlist } = useWishlistStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center animate-fade-in">
        <EmptyState
          variant="wishlist"
          actionLabel={t('shopNow')}
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('wishlist.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} {t('products')}
          </p>
        </div>
        <Button
          variant="outline"
          className="self-start sm:self-auto text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
          onClick={clearWishlist}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('clearFilters')}
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
