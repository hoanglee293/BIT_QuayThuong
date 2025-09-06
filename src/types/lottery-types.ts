export interface User {
  id: number;
  name: string;
  telegram_id: string;
}

export interface LotteryCode {
  id: string;
  code: string;
  user_id: number;
  input_number: number;
  is_used: boolean;
  created_at: string;
  user: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface LotteryResponse {
  data: LotteryCode[];
  pagination: Pagination;
}

export interface LotteryFilters {
  page?: number;
  limit?: number;
  search?: string;
  code?: string;
  telegram_id?: string;
  input_number?: string;
  is_used?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}
