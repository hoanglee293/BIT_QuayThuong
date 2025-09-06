'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { LotteryFilters } from '@/types/lottery';
import { useLang } from '@/lang/useLang';

interface LotteryFiltersProps {
  onFiltersChange: (filters: LotteryFilters) => void;
  loading?: boolean;
}

const LotteryFiltersComponent: React.FC<LotteryFiltersProps> = ({
  onFiltersChange,
  loading = false
}) => {
  const { t } = useLang();
  const [filters, setFilters] = useState<LotteryFilters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

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

  return (
    <Card className="mb-6 p-8 bg-card border-none shadow-inset dark:shadow-none dark:border-solid">
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
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.lotteryCode')}</label>
            <Input
              placeholder={t('lottery.filters.lotteryCodePlaceholder')}
              value={filters.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.telegramId')}</label>
              <Input
                placeholder={t('lottery.filters.telegramIdPlaceholder')}
                value={filters.telegram_id || ''}
                onChange={(e) => handleInputChange('telegram_id', e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.uid')}</label>
              <Input
                placeholder={t('lottery.filters.uidPlaceholder')}
                value={filters.input_number || ''}
                onChange={(e) => handleInputChange('input_number', e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.fromDate')}</label>
              <Input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('lottery.filters.toDate')}</label>
              <Input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
          </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('lottery.filters.sortBy')}</label>
            <Select
              value={filters.sort_by || 'created_at'}
              onValueChange={(value) => handleInputChange('sort_by', value)}
            >
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">{t('lottery.filters.createdAt')}</SelectItem>
                <SelectItem value="code">{t('lottery.filters.code')}</SelectItem>
                <SelectItem value="input_number">{t('lottery.filters.inputNumber')}</SelectItem>
                <SelectItem value="is_used">{t('lottery.filters.isUsed')}</SelectItem>
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
              <SelectContent>
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
              <SelectContent>
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
          {/* Action Buttons */}
          <div className="flex items-end h-full gap-2 pt-4">
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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


      </CardContent>
    </Card>
  );
};

export default LotteryFiltersComponent;
