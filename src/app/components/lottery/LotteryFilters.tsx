'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Search, Filter, RotateCcw, Download } from 'lucide-react';
import { LotteryFilters } from '@/types/lottery-types';
import { useLang } from '@/lang/useLang';
import { exportToExcel } from '@/utils/exportToExcel';
import { axiosClient } from '@/utils/axiosClient';

interface LotteryFiltersProps {
  onFiltersChange: (filters: LotteryFilters) => void;
  loading?: boolean;
  data?: any[];
  currentFilters?: LotteryFilters;
}

const LotteryFiltersComponent: React.FC<LotteryFiltersProps> = ({
  onFiltersChange,
  loading = false,
  data,
  currentFilters
}) => {
  const { t, lang } = useLang();
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [filters, setFilters] = useState<LotteryFilters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    start_date: getTodayDate(),
    end_date: getTodayDate()
  });

  // Sync local state with currentFilters prop
  React.useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper function để tạo translations object
  const createTranslations = () => ({
    headers: {
      stt: t('lottery.excel.headers.stt'),
      id: t('lottery.excel.headers.id'),
      code: t('lottery.excel.headers.code'),
      userName: t('lottery.excel.headers.userName'),
      telegramId: t('lottery.excel.headers.telegramId'),
      inputNumber: t('lottery.excel.headers.inputNumber'),
      status: t('lottery.excel.headers.status'),
      createdAt: t('lottery.excel.headers.createdAt'),
      used: t('lottery.excel.headers.used'),
      unused: t('lottery.excel.headers.unused')
    },
    sheets: {
      lotteryData: t('lottery.excel.sheets.lotteryData'),
      statistics: t('lottery.excel.sheets.statistics'),
      detailedData: t('lottery.excel.sheets.detailedData')
    },
    stats: {
      title: t('lottery.excel.stats.title'),
      totalCodes: t('lottery.excel.stats.totalCodes'),
      usedCodes: t('lottery.excel.stats.usedCodes'),
      remainingCodes: t('lottery.excel.stats.remainingCodes'),
      usageRate: t('lottery.excel.stats.usageRate'),
      exportDate: t('lottery.excel.stats.exportDate')
    }
  });

  // Helper function để lấy locale
  const getLocale = () => {
    const localeMap: { [key: string]: string } = {
      'vi': 'vi-VN',
      'en': 'en-US',
      'kr': 'ko-KR',
      'jp': 'ja-JP'
    };
    return localeMap[lang] || 'vi-VN';
  };

  const handleInputChange = (field: keyof LotteryFilters, value: string) => {
    const newFilters = { ...filters, [field]: value === 'all' ? undefined : (value || undefined) };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, page: 1 });
  };

  const handleReset = () => {
    const resetFilters: LotteryFilters = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'DESC'
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle Excel export
  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      alert(t('lottery.noDataToExport'));
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `lottery_data_${timestamp}.xlsx`;

    const success = exportToExcel(data, filename, createTranslations(), getLocale());
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

      const success = exportToExcel(allData, filename, createTranslations(), getLocale());
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
    <Card className="mb-6 p-8 pt-7 bg-card border-none shadow-inset dark:shadow-none dark:border-solid">
      <CardHeader className="p-0 pb-5">
        <CardTitle className="flex items-center gap-2 m-0 p-0 text-card-foreground">
          <Filter className="h-5 w-5" />
          {t('lottery.filters.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.generalSearch')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('lottery.filters.generalSearchPlaceholder')}
                value={filters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.sortBy')}</label>
            <Select
              value={filters.sort_by || 'created_at'}
              onValueChange={(value) => handleInputChange('sort_by', value)}
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black border-input text-foreground">
                <SelectItem value="created_at">{t('lottery.filters.createdAt')}</SelectItem>
                <SelectItem value="code">{t('lottery.filters.code')}</SelectItem>
                <SelectItem value="input_number">{t('lottery.filters.inputNumber')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.order')}</label>
            <Select
              value={filters.sort_order || 'DESC'}
              onValueChange={(value) => handleInputChange('sort_order', value as 'ASC' | 'DESC')}
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black border-input text-foreground">
                <SelectItem value="DESC">{t('lottery.filters.descending')}</SelectItem>
                <SelectItem value="ASC">{t('lottery.filters.ascending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.itemsPerPage')}</label>
            <Select
              value={filters.limit?.toString() || '10'}
              onValueChange={(value) => handleInputChange('limit', value)}
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black border-input text-foreground">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.status')}</label>
            <Select
              value={filters.is_used || 'all'}
              onValueChange={(value) => handleInputChange('is_used', value)}
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue placeholder={t('lottery.filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lottery.filters.all')}</SelectItem>
                <SelectItem value="false">{t('lottery.filters.unused')}</SelectItem>
                <SelectItem value="true">{t('lottery.filters.used')}</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-end justify-between gap-2 w-full">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.fromDate')}</label>
              <Input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.toDate')}</label>
              <Input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-end h-full gap-2 pt-4">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-theme-primary-500 text-primary-foreground text-white hover:bg-theme-primary-500/90"
              >
                <Search className="h-4 w-4 mr-2" />
                {t('lottery.filters.search')}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('lottery.filters.reset')}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.exportFiltered')}</label>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleExportExcel}
                disabled={loading || !data || data.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs p-2 h-10"
                size="sm"
              >
                <Download className="h-3 w-3" />
                {t('lottery.exportFilteredData')}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.exportAll')}</label>
            <Button
              onClick={handleExportAllExcel}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs p-2 h-10 w-full"
              size="sm"
            >
              <Download className="h-3 w-3" />
              {t('lottery.exportAllData')}
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Action Buttons */}

          <div className="flex items-end justify-end gap-2 w-full" />
          
        </div>


      </CardContent>
    </Card>
  );
};

export default LotteryFiltersComponent;
