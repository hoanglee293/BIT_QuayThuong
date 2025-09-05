'use client';

import React from 'react';
import { useLottery } from '@/hooks/useLottery';
import { LotteryFilters } from '@/types/lottery';
import LotteryFiltersComponent from '@/app/components/lottery/LotteryFilters';
import LotteryTable from '@/app/components/lottery/LotteryTable';
import LotteryPagination from '@/app/components/lottery/LotteryPagination';
import { Alert, AlertDescription } from '@/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/ui/button';

const Lotterys = () => {
  const { data, pagination, loading, error, fetchLotteries, refetch } = useLottery();

  const handleFiltersChange = (filters: LotteryFilters) => {
    fetchLotteries(filters);
  };

  const handlePageChange = (page: number) => {
    if (pagination) {
      fetchLotteries({
        ...pagination,
        page
      });
    }
  };

  const handleLimitChange = (limit: number) => {
    if (pagination) {
      fetchLotteries({
        ...pagination,
        limit,
        page: 1 // Reset to first page when changing limit
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý mã dự thưởng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các mã dự thưởng trong hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <LotteryFiltersComponent
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Table */}
      <LotteryTable
        data={data}
        loading={loading}
      />

      {/* Pagination */}
      {pagination && (
        <LotteryPagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Lotterys;