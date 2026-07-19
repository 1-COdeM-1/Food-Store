import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  description?: string;
}

export function ErrorPage({ statusCode = 404, title, description }: ErrorPageProps) {
  const { t } = useTranslation('common');

  const displayTitle = title || t('error.404.title');
  const displayDescription = description || t('error.404.description');

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
          <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">{statusCode}</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {displayTitle}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {displayDescription}
        </p>

        {/* Action */}
        <Link to="/">
          <Button size="lg" className="rounded-xl">
            <Home className="w-5 h-5 mr-2" />
            {t('error.404.backHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
