'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Pagination } from '@/types/lottery';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (total_pages <= maxVisiblePages) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < total_pages) {
        if (endPage < total_pages - 1) {
          pages.push('...');
        }
        pages.push(total_pages);
      }
    }
    
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Info */}
      <div className="text-sm text-gray-600">
        Hiển thị {startItem} - {endItem} trong tổng số {total.toLocaleString()} kết quả
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!has_prev || loading}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  disabled={loading}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(total_pages)}
          disabled={!has_next || loading}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Hiển thị:</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(parseInt(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">/ trang</span>
      </div>
    </div>
  );
};

export default LotteryPagination;
