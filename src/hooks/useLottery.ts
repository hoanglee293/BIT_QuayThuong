'use client';

import { useState, useEffect, useCallback } from 'react';
import { LotteryCode, LotteryResponse, LotteryFilters, Pagination } from '@/types/lottery';

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
      const url = `/api/v1/lotterys${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Vui lòng đăng nhập lại');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Bad Request');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LotteryResponse = await response.json();
      setData(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
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
