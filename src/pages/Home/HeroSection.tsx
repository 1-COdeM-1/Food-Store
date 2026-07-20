import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const { t } = useTranslation('common');
  const { language, dir } = useLanguageStore();
  const navigate = useNavigate();
  const categoriesRef = useRef<HTMLDivElement>(null);

  const isRTL = dir === 'rtl';

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section
        className={cn(
          'relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4.5rem)]',
          'flex items-center justify-center overflow-hidden',
          'bg-gradient-to-br from-primary/5 via-background to-secondary/20',
          'dark:from-primary/10 dark:via-background dark:to-secondary/10'
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0.75s' }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-primary/10 border border-primary/20',
                'text-primary text-sm font-medium',
                'animate-fade-in-up'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('newArrivals')}
            </div>

            {/* Headline */}
            <h1
              className={cn(
                'mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight',
                'text-foreground leading-[1.1]',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: '100ms', opacity: 0 }}
            >
              {language === 'ar' ? (
                <>
                  اكتشف منتجات
                  <span className="text-primary block mt-2">متميزة وفاخرة</span>
                </>
              ) : (
                <>
                  Discover Premium
                  <span className="text-primary block mt-2">Quality Products</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p
              className={cn(
                'mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: '200ms', opacity: 0 }}
            >
              {t('hero.description')}
            </p>


            <div
              className={cn(
                'mt-10 flex flex-col sm:flex-row items-center justify-center gap-4',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: '300ms', opacity: 0 }}
              dir={dir}
            >
              <Button
                size="lg"
                onClick={() => navigate('/shop')}
                className={cn(
                  'h-12 px-8 text-base font-semibold rounded-xl',
                  'shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
                )}
              >
                {t('hero.ctaShop')}
                <ArrowRight
                  className={cn(
                    'w-5 h-5',
                    isRTL ? 'mr-2 rotate-180' : 'ml-2'
                  )}
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToCategories}
                className="h-12 px-8 text-base font-semibold rounded-xl hover:bg-accent transition-all duration-300"
              >
                {t('hero.ctaCategories')}
              </Button>
            </div>

            {/* Stats */}

          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToCategories}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 animate-bounce"
          aria-label="Scroll to categories"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* Anchor for scroll */}
      <div ref={categoriesRef} />
    </>
  );
}
