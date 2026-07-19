import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Star,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Phone,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/shared/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { useLanguageStore } from '@/store/languageStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { formatPrice, generateWhatsAppUrl } from '@/utils/format';
import type { Product } from '@/types';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('common');
  const { language, dir } = useLanguageStore();
  const navigate = useNavigate();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('No product ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        if (data) {
          setProduct(data);
          const related = await productService.getRelatedProducts(id, 4);
          setRelatedProducts(related);
        } else {
          setError(`Product with ID "${id}" was not found.`);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <Package className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {error ?? t('error.404.title')}
        </h2>
        <p className="text-muted-foreground text-sm">
          Product ID: <code className="bg-muted px-2 py-0.5 rounded">{id}</code>
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/shop')}
        >
          {t('error.404.backHome')}
        </Button>
      </div>
    );
  }

  const displayTitle = language === 'ar' ? product.titleAr : product.title;
  const displayDescription =
    language === 'ar' ? product.descriptionAr : product.description;
  const displayCategory =
    language === 'ar' ? product.categoryAr : product.category;

  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.discount || 0;
  const originalPrice = product.price;
  const sellPrice = discountPercentage > 0 
    ? originalPrice - (originalPrice * (discountPercentage / 100))
    : originalPrice;

  const whatsappUrl = generateWhatsAppUrl(
    product.whatsappNumber,
    displayTitle,
    sellPrice,
    language
  );

  const images = product.images?.length
    ? product.images
    : [product.image];

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          aria-label="Breadcrumb"
          dir={dir}
        >
          <Link to="/" className="hover:text-primary transition-colors">
            {t('product.breadcrumb.home')}
          </Link>
          <ChevronRight
            className={cn('w-4 h-4', dir === 'rtl' && 'rotate-180')}
          />
          <Link to="/shop" className="hover:text-primary transition-colors">
            {t('product.breadcrumb.shop')}
          </Link>
          <ChevronRight
            className={cn('w-4 h-4', dir === 'rtl' && 'rotate-180')}
          />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {displayTitle}
          </span>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft
            className={cn('w-4 h-4', dir === 'rtl' ? 'mr-2 rotate-180' : 'mr-2')}
          />
          {t('back')}
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
              <img
                src={images[selectedImage]}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0',
                      selectedImage === i
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${displayTitle} - ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-sm font-medium text-primary hover:underline uppercase tracking-wide"
              >
                {displayCategory}
              </Link>
              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {displayTitle}
              </h1>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product.rating!)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} {t('reviews')})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {formatPrice(sellPrice)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-xl text-red-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-full">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {displayDescription}
            </p>

            {/* SKU & Stock */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {product.sku && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>SKU: {product.sku}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    product.inStock ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                />
                <span
                  className={cn(
                    product.inStock ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {product.inStock ? t('inStock') : t('outOfStock')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                size="lg"
                className={cn(
                  'h-12 px-8 rounded-xl font-semibold',
                  'bg-green-600 hover:bg-green-700 text-white',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                )}
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('shareOnWhatsApp')}
              </Button>

              <Button
                size="lg"
                className={cn(
                  'h-12 px-8 rounded-xl font-semibold',
                  'bg-blue-600 hover:bg-blue-700 text-white',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                )}
                onClick={() => {
                  const cleanPhone = product.whatsappNumber.replace(/\D/g, '');
                  window.location.href = `tel:+${cleanPhone}`;
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('callSeller')}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className={cn(
                  'h-12 px-6 rounded-xl font-semibold transition-all duration-200',
                  inWishlist
                    ? 'border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600'
                    : 'hover:-translate-y-0.5'
                )}
                onClick={() => toggleItem(product)}
              >
                <Heart
                  className={cn('w-5 h-5 mr-2', inWishlist && 'fill-current')}
                />
                {inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'للطلبات فوق $100' : 'Orders over $100'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'منتجات أصلية 100%' : '100% Authentic'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {language === 'ar' ? 'إرجاع سهل' : 'Easy Returns'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'خلال 30 يوماً' : '30 Days Return'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
              {t('product.relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
