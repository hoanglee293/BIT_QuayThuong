'use client';

import React from 'react';
import { useLottery } from '@/hooks/useLottery';
import { LotteryFilters } from '@/types/lottery';
import LotteryFiltersComponent from '@/app/components/lottery/LotteryFilters';
import LotteryTable from '@/app/components/lottery/LotteryTable';
import LotteryPagination from '@/app/components/lottery/LotteryPagination';
import { Alert, AlertDescription } from '@/ui/alert';
import { AlertCircle, RefreshCw, Ticket, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';

const Lotterys = () => {
  const { data, pagination, loading, error, fetchLotteries, refetch } = useLottery();

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
  const totalCodes = data?.length || 0;
  const usedCodes = data?.filter(code => code.is_used).length || 0;
  const availableCodes = totalCodes - usedCodes;
  const usageRate = totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-slate-500 dark:bg-gray-800 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 px-8 py-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    Tổng quan
                  </h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-2 min-w-40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Ticket className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng mã</p>
                          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{totalCodes.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-2 min-w-40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">Đã sử dụng</p>
                          <p className="text-xl font-bold text-green-900 dark:text-green-100">{usedCodes.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                    <CardContent className="p-2 min-w-40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Còn lại</p>
                          <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{availableCodes.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={refetch}
                      disabled={loading}
                      className="flex items-center gap-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-white/20 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 shadow-lg text-xs p-2"
                    >
                      <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                      Làm mới
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-2xl blur-2xl"></div>
          <div className="relative">
            <LotteryFiltersComponent
              onFiltersChange={handleFiltersChange}
              loading={loading}
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
            />
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 px-8 shadow-lg">
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