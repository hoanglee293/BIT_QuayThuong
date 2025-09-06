'use client';

import React from 'react';
import { useLottery } from '@/hooks/useLottery';
import { LotteryFilters } from '@/types/lottery-types';
import LotteryFiltersComponent from '@/app/components/lottery/LotteryFilters';
import LotteryTable from '@/app/components/lottery/LotteryTable';
import LotteryPagination from '@/app/components/lottery/LotteryPagination';
import { RefreshCw, Ticket, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { useLang } from '@/lang/useLang';

const Lotterys = () => {
  const { data, pagination, loading, fetchLotteries, refetch } = useLottery();
  const { t } = useLang();

  const handleFiltersChange = (filters: LotteryFilters) => {
    fetchLotteries(filters);
  };

  const handlePageChange = (page: number) => {
    if (pagination) {
      fetchLotteries({
        page,
        limit: pagination.limit
      });
    }
  };

  const handleLimitChange = (limit: number) => {
    if (pagination) {
      fetchLotteries({
        page: 1, // Reset to first page when changing limit
        limit
      });
    }
  };

  // Calculate statistics
  const totalCodes = pagination?.total || 0;
  const usedCodes = data?.filter(code => code.is_used).length || 0;
  const availableCodes = totalCodes - usedCodes;


  return (
    <div className="min-h-screen bg-white dark:bg-black w-full">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Filters */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-2xl blur-2xl"></div>
          <div className="relative">
            <LotteryFiltersComponent
              onFiltersChange={handleFiltersChange}
              loading={loading}
              data={data}
            />
          </div>
        </div>

        {/* Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 via-gray-600/5 to-zinc-600/5 rounded-2xl blur-2xl"></div>
          <div className="relative">
            <LotteryTable
              data={data}
              loading={loading}
              total={pagination?.total}
            />
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-2xl blur-2xl"></div>
            <div className="relative ">
              <LotteryPagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lotterys;
