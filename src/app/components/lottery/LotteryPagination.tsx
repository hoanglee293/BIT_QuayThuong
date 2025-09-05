'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Pagination } from '@/types/lottery';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const { page, limit } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Current Page Info */}
      <div className="text-sm text-gray-600">
        Trang {page}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Current Page */}
        <Button
          variant="default"
          size="sm"
          disabled={loading}
          className="w-8 h-8 p-0"
        >
          {page}
        </Button>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={loading}
        >
          <ChevronRight className="h-4 w-4" />
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
          <SelectContent className="bg-gray-300 dark:bg-gray-800 ">
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
