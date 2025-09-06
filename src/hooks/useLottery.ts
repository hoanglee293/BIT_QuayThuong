'use client';

import { useState, useEffect, useCallback } from 'react';
import { LotteryCode, LotteryResponse, LotteryFilters, Pagination } from '@/types/lottery-types';
import { axiosClient } from '@/utils/axiosClient';

interface UseLotteryReturn {
  data: LotteryCode[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetchLotteries: (filters: LotteryFilters) => Promise<void>;
  refetch: () => void;
}

export const useLottery = (): UseLotteryReturn => {
  const [data, setData] = useState<LotteryCode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<LotteryFilters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

  const buildQueryString = (filters: LotteryFilters): string => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  const fetchLotteries = useCallback(async (filters: LotteryFilters) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      const queryString = buildQueryString(filters);
      const url = `/lotterys${queryString ? `?${queryString}` : ''}`;
      
      const response = await axiosClient.get<LotteryResponse>(url);

      setData(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      let errorMessage = 'Có lỗi xảy ra khi tải dữ liệu';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized - Vui lòng đăng nhập lại';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || 'Bad Request';
        } else {
          errorMessage = err.response.data?.message || `HTTP error! status: ${err.response.status}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
      } else {
        // Other error
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setData([]);
      setPagination(null);
      console.error('Error fetching lotteries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (currentFilters) {
      fetchLotteries(currentFilters);
    }
  }, [currentFilters, fetchLotteries]);

  // Initial fetch
  useEffect(() => {
    fetchLotteries(currentFilters);
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    fetchLotteries,
    refetch
  };
};
