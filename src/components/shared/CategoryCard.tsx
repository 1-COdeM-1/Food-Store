import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/languageStore';
import type { DynamicCategory } from '@/services/productService';
import { cn } from '@/utils/cn';
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const icons = [Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen];

const colors = [
  'from-blue-500/20 to-blue-600/10',
  'from-purple-500/20 to-purple-600/10',
  'from-amber-500/20 to-amber-600/10',
  'from-emerald-500/20 to-emerald-600/10',
  'from-pink-500/20 to-pink-600/10',
  'from-orange-500/20 to-orange-600/10',
];

interface CategoryCardProps {
  category: DynamicCategory;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { t } = useTranslation('common');
  const { language, dir } = useLanguageStore();
  const navigate = useNavigate();
  
  const IconComponent = icons[index % icons.length];
  const colorClass = colors[index % colors.length];

  const handleClick = () => {
    navigate(`/shop?category=${category.id}`);
  };

  const displayName = language === 'ar' ? category.nameAr : category.name;

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left',
        'transition-all duration-300 ease-soft',
        'hover:shadow-soft-lg hover:border-primary/20 hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'animate-fade-in-up w-full'
      )}
      style={{ animationDelay: `${index * 75}ms`, opacity: 0 }}
      dir={dir}
      aria-label={`${t('categories')}: ${displayName}`}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
          colorClass,
          'group-hover:opacity-100'
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={cn(
            'inline-flex items-center justify-center w-12 h-12 rounded-xl',
            'bg-primary/10 text-primary',
            'transition-transform duration-300 group-hover:scale-110'
          )}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {displayName}
        </h3>
        <p className="mt-3 text-xs font-medium text-primary">
          {category.count} {t('products')}
        </p>
      </div>
    </button>
  );
}
