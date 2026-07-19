import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn } from '@/utils/cn';
import { formatPrice, generateWhatsAppUrl } from '@/utils/format';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, index = 0, viewMode = 'grid' }: ProductCardProps) {
  const { t } = useTranslation('common');
  const { language } = useLanguageStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.discount || 0;
  const originalPrice = product.price;
  const sellPrice = discountPercentage > 0 
    ? originalPrice - (originalPrice * (discountPercentage / 100))
    : originalPrice;

  const displayTitle = language === 'ar' ? product.titleAr : product.title;
  const displayDescription =
    language === 'ar' ? product.descriptionAr : product.description;
  const displayCategory =
    language === 'ar' ? product.categoryAr : product.category;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateWhatsAppUrl(
      product.whatsappNumber,
      displayTitle,
      sellPrice,
      language
    );
    window.open(url, '_blank');
  };

  const handleViewDetails = () => {
    navigate(`/shop/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-card p-4',
          'transition-all duration-300 ease-soft',
          'hover:shadow-soft-lg hover:border-primary/20',
          'animate-fade-in cursor-pointer'
        )}
        style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        onClick={handleViewDetails}
        role="article"
        aria-label={displayTitle}
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          <img
            src={product.image}

            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{t('outOfStock')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide">
              {displayCategory}
            </p>
            <h3 className="mt-1 text-base font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {displayDescription}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(sellPrice, language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
              {discountPercentage > 0 && (
                <span className="text-sm text-red-500 line-through">
                  {formatPrice(originalPrice, language === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-full transition-all duration-200',
                  inWishlist
                    ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600'
                    : 'hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                )}
                onClick={handleWishlist}
                aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              >
                <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                onClick={handleWhatsApp}
                aria-label={t('shareOnWhatsApp')}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card overflow-hidden',
        'transition-all duration-300 ease-soft',
        'hover:shadow-soft-lg hover:border-primary/20 hover:-translate-y-1',
        'animate-fade-in-up cursor-pointer'
      )}
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
      onClick={handleViewDetails}
      role="article"
      aria-label={displayTitle}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 flex items-center justify-center gap-3',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          )}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            aria-label={t('viewDetails')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              'h-10 w-10 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75',
              inWishlist
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-gray-900 hover:bg-white'
            )}
            onClick={handleWishlist}
            aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
          >
            <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 hover:text-green-600"
            onClick={handleWhatsApp}
            aria-label={t('shareOnWhatsApp')}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              -{discountPercentage}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              {t('featured')}
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">{t('outOfStock')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-medium text-primary uppercase tracking-wide">
          {displayCategory}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {displayTitle}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {displayDescription}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">
              {formatPrice(sellPrice, language === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-red-500 line-through">
                {formatPrice(originalPrice, language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
