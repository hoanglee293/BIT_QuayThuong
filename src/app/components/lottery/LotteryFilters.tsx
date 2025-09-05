'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { LotteryFilters } from '@/types/lottery';

interface LotteryFiltersProps {
  onFiltersChange: (filters: LotteryFilters) => void;
  loading?: boolean;
}

const LotteryFiltersComponent: React.FC<LotteryFiltersProps> = ({ 
  onFiltersChange, 
  loading = false 
}) => {
  const [filters, setFilters] = useState<LotteryFilters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof LotteryFilters, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc mã dự thưởng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tìm kiếm tổng quát</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo mã, số input, telegram ID..."
                value={filters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mã dự thưởng</label>
            <Input
              placeholder="Nhập mã dự thưởng..."
              value={filters.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={filters.is_used || ''}
              onValueChange={(value) => handleInputChange('is_used', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                <SelectItem value="false">Chưa sử dụng</SelectItem>
                <SelectItem value="true">Đã sử dụng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telegram ID</label>
              <Input
                placeholder="Nhập Telegram ID..."
                value={filters.telegram_id || ''}
                onChange={(e) => handleInputChange('telegram_id', e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số input</label>
              <Input
                placeholder="Nhập số input..."
                value={filters.input_number || ''}
                onChange={(e) => handleInputChange('input_number', e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <Input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <Input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sắp xếp theo</label>
            <Select
              value={filters.sort_by || 'created_at'}
              onValueChange={(value) => handleInputChange('sort_by', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Ngày tạo</SelectItem>
                <SelectItem value="code">Mã dự thưởng</SelectItem>
                <SelectItem value="input_number">Số input</SelectItem>
                <SelectItem value="is_used">Trạng thái</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Thứ tự</label>
            <Select
              value={filters.sort_order || 'DESC'}
              onValueChange={(value) => handleInputChange('sort_order', value as 'ASC' | 'DESC')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Giảm dần</SelectItem>
                <SelectItem value="ASC">Tăng dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Số lượng/trang</label>
            <Select
              value={filters.limit?.toString() || '10'}
              onValueChange={(value) => handleInputChange('limit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotteryFiltersComponent;
