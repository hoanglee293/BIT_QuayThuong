'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Pagination } from '@/types/lottery-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/lang/useLang';

interface LotteryPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;
}

const LotteryPagination: React.FC<LotteryPaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false
}) => {
  const { page, limit, total, total_pages, has_next, has_prev } = pagination;
  const { t } = useLang();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (total_pages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, page - 2);
      const end = Math.min(total_pages, page + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < total_pages) {
        if (end < total_pages - 1) pages.push('...');
        pages.push(total_pages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-end gap-4">
      {/* Page Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t('lottery.pagination.showing')} {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} {t('lottery.pagination.of')} {total} {t('lottery.pagination.results')}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="px-2 py-1 text-sm text-gray-500">...</span>
            ) : (
              <Button
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum as number)}
                disabled={loading}
                className={`h-8 w-8 b p-0 ${pageNum === page ? "bg-theme-primary-500 text-white" : ""}`}
              >
                {pageNum}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next || loading}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t('lottery.pagination.show')}: {limit}</span>
        {/* <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(parseInt(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select> */}
        <span className="text-sm text-gray-600 dark:text-gray-400">{t('lottery.pagination.perPage')}</span>
      </div>
    </div>
  );
};

export default LotteryPagination;
