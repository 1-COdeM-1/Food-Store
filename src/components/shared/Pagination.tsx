import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: PaginationProps) {
  const { t } = useTranslation('common');
  const { dir } = useLanguageStore();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  const LeftIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const RightIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const FirstIcon = dir === 'rtl' ? ChevronsRight : ChevronsLeft;
  const LastIcon = dir === 'rtl' ? ChevronsLeft : ChevronsRight;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {totalItems !== undefined && (
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          {totalItems} {t('products')}
        </p>
      )}

      <nav
        className="flex items-center gap-1 order-1 sm:order-2"
        aria-label="Pagination"
      >
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <FirstIcon className="h-4 w-4" />
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <LeftIcon className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              className={cn(
                'h-9 w-9 text-sm font-medium transition-all duration-200',
                currentPage === page && 'shadow-glow'
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <RightIcon className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <LastIcon className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
