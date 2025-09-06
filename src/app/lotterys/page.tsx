'use client';

import React from 'react';
import { useLottery } from '@/hooks/useLottery';
import { LotteryFilters } from '@/types/lottery';
import LotteryFiltersComponent from '@/app/components/lottery/LotteryFilters';
import LotteryTable from '@/app/components/lottery/LotteryTable';
import LotteryPagination from '@/app/components/lottery/LotteryPagination';
import { Alert, AlertDescription } from '@/ui/alert';
import { AlertCircle, RefreshCw, Ticket, TrendingUp, Users, Award, Download } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { exportToExcel } from '@/utils/exportToExcel';
import { axiosClient } from '@/utils/axiosClient';
import { useLang } from '@/lang/useLang';

const Lotterys = () => {
  const { data, pagination, loading, error, fetchLotteries, refetch } = useLottery();
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
  const totalCodes = data?.length || 0;
  const usedCodes = data?.filter(code => code.is_used).length || 0;
  const availableCodes = totalCodes - usedCodes;
  const usageRate = totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : '0';

  // Handle Excel export
  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      alert(t('lottery.noDataToExport'));
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `lottery_data_${timestamp}.xlsx`;

    const success = exportToExcel(data, filename);
    if (success) {
      alert(t('lottery.exportSuccess'));
    } else {
      alert(t('lottery.exportError'));
    }
  };

  const handleExportAllExcel = async () => {
    try {
      // Gọi API để lấy tất cả dữ liệu lottery
      const response = await axiosClient.get('/lotterys?get_all=true');
      const allData = response.data.data || [];

      if (allData.length === 0) {
        alert(t('lottery.noDataToExport'));
        return;
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `lottery_all_data_${timestamp}.xlsx`;

      const success = exportToExcel(allData, filename);
      if (success) {
        alert(t('lottery.exportAllSuccess', { count: allData.length }));
      } else {
        alert(t('lottery.exportError'));
      }
    } catch (error: any) {
      console.error('Error fetching all lottery data:', error);
      let errorMessage = t('lottery.dataLoadError');

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = t('lottery.unauthorized');
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || t('lottery.badRequest');
        } else {
          errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = t('lottery.connectionError');
      } else {
        errorMessage = error.message || errorMessage;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative shadow-inset dark:shadow-none dark:border-solid bg-transparent dark:bg-gray-800 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 px-8 py-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    {t('lottery.overview')}
                  </h1>
                </div>

                <div className="flex gap-3">
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br border-none from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                      <CardContent className="p-2 min-w-40">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Ticket className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('lottery.totalCodes')}</p>
                            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{totalCodes.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br border-none from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardContent className="p-2 min-w-40">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">{t('lottery.usedCodes')}</p>
                            <p className="text-xl font-bold text-green-900 dark:text-green-100">{usedCodes.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-700 bg-white border-none">
                      <CardContent className="p-2 min-w-40">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-800 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('lottery.remainingCodes')}</p>
                            <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{availableCodes.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-700 bg-white border-none">
                      <CardContent className="p-2 min-w-40">
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={handleExportExcel}
                            disabled={loading || !data || data.length === 0}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs p-2 h-8"
                            size="sm"
                          >
                            <Download className="h-3 w-3" />
                            {t('lottery.exportFilteredData')}
                          </Button>
                          <Button
                            onClick={handleExportAllExcel}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs p-2 h-8"
                            size="sm"
                          >
                            <Download className="h-3 w-3" />
                            {t('lottery.exportAllData')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={refetch}
                      disabled={loading}
                      className="flex items-center gap-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-white/20 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 shadow-lg text-xs p-2 max-h-8"
                    >
                      <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                      {t('lottery.refresh')}
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
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 px-8 shadow-lg shadow-inset dark:shadow-none dark:border-solid">
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