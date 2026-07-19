import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { NAV_ITEMS } from '@/constants';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { language } = useLanguageStore();
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-soft',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-soft'
            : 'bg-transparent'
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="LuxeMarket Home"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {t('appName')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
                  )}
                >
                  {language === 'ar' ? item.labelAr : item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={toggleTheme}
                aria-label={t('theme.dark')}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </Button>

              {/* Language Toggle */}
              {/* <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground gap-1.5"
                onClick={toggleLanguage}
                aria-label="Toggle language"
              >
                <Globe className="h-[18px] w-[18px]" />
                <span className="text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
              </Button> */}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-9 w-9 rounded-lg',
                    isActive('/wishlist')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-label={t('wishlist')}
                >
                  <Heart className="h-[18px] w-[18px]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'w-full max-w-xs py-3 px-6 text-center text-lg font-medium rounded-xl transition-all duration-200',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              style={{
                animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {language === 'ar' ? item.labelAr : item.label}
            </Link>
          ))}

          {/* Mobile Language Toggle */}
          {/* <Button
            variant="outline"
            className="mt-4 w-full max-w-xs"
            onClick={() => {
              toggleLanguage();
              setIsMobileMenuOpen(false);
            }}
          >
            <Globe className="h-4 w-4 mr-2" />
            {language === 'en' ? t('language.arabic') : t('language.english')}
          </Button> */}
        </div>
      </div>
    </>
  );
}
