import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Phone,
  MapPin,
  Facebook,
  ArrowUp,
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { NAV_ITEMS } from '@/constants';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { t } = useTranslation('common');
  const { language } = useLanguageStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-12 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {t('appName')}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={"https://www.facebook.com/share/1HkmbADvQ3/"}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-14 h-14 rounded-lg bg-background border border-border',
                  'flex items-center justify-center text-muted-foreground',
                  'hover:text-primary hover:border-primary/30 transition-all duration-200'
                )}
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {language === 'ar' ? item.labelAr : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {t('contactUs')}
            </h3>
            <ul className="mt-4 space-y-3">
              
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">01121638405 </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  الخانكة- أمام مدرسة الصنائع الثانويه بنين
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} {t('appName')}. {t('copyright')}.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="gap-2 text-xs"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            {t('backToTop')}
          </Button>
        </div>
      </div>
    </footer>
  );
}
