'use client';

import { useState, useEffect, useCallback } from 'react';
import { LotteryCode, LotteryResponse, LotteryFilters, Pagination } from '@/types/lottery-types';
import { axiosClient } from '@/utils/axiosClient';
import toast from 'react-hot-toast';
import { useLang } from '@/lang/useLang';

interface UseLotteryReturn {
  data: LotteryCode[];
  pagination: Pagination | null;
  loading: boolean;
  currentFilters: LotteryFilters | null;
  fetchLotteries: (filters: LotteryFilters) => Promise<void>;
  refetch: () => void;
}

export const useLottery = (): UseLotteryReturn => {
  const { t } = useLang();
  const [data, setData] = useState<LotteryCode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [currentFilters, setCurrentFilters] = useState<LotteryFilters>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'DESC',
    start_date: getTodayDate(),
    end_date: getTodayDate()
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
    setCurrentFilters(filters);

    try {
      const queryString = buildQueryString(filters);
      const url = `/lotterys${queryString ? `?${queryString}` : ''}`;

      const response = await axiosClient.get<LotteryResponse>(url);

      setData(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      let errorMessage = t('lottery.dataLoadError');

      console.log("err", err.response.data?.message.includes('greater than'));

      if (err.response.status === 401) {
        errorMessage = t('lottery.unauthorized');
      } else if (err.response.data?.message.includes('Start date cannot be greater than end date')) {
        errorMessage = t('lottery.filters.startDateGreaterThanEndDate');
      } else if (err.response.data?.message.includes('Unauthorized')) {
        errorMessage = t('lottery.unauthorized');
      } else if (err.response.data?.message.includes('should not be empty')) {
        errorMessage = t('lottery.filters.shouldNotBeEmpty');
      }

      toast.error(errorMessage);
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
    currentFilters,
    fetchLotteries,
    refetch
  };
};
