import { PackageX, SearchX, HeartOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  variant?: 'products' | 'search' | 'wishlist' | 'general';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  products: PackageX,
  search: SearchX,
  wishlist: HeartOff,
  general: PackageX,
};

export function EmptyState({
  variant = 'general',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation('common');
  const Icon = iconMap[variant];

  const defaultTitle = {
    products: t('noResults'),
    search: t('noResults'),
    wishlist: t('wishlist.empty'),
    general: t('noResults'),
  }[variant];

  const defaultDescription = {
    products: t('noResultsDescription'),
    search: t('noResultsDescription'),
    wishlist: t('wishlist.emptyDescription'),
    general: t('noResultsDescription'),
  }[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        'animate-fade-in',
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
        <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-foreground">
        {title || defaultTitle}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description || defaultDescription}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6"
          variant="outline"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
