# Lottery Management Components

Bộ components quản lý mã dự thưởng với đầy đủ tính năng tìm kiếm, lọc và phân trang.

## Components

### 1. LotteryFilters
Component bộ lọc với các tính năng:
- Tìm kiếm tổng quát
- Lọc theo mã dự thưởng, trạng thái
- Bộ lọc nâng cao (Telegram ID, số input, khoảng thời gian)
- Sắp xếp và chọn số lượng hiển thị

### 2. LotteryTable
Bảng hiển thị danh sách mã dự thưởng với:
- Hiển thị đầy đủ thông tin mã dự thưởng
- Copy mã dự thưởng
- Badge trạng thái với icon
- Format ngày tháng tiếng Việt
- Responsive design

### 3. LotteryPagination
Component phân trang với:
- Điều hướng trang (first, prev, next, last)
- Hiển thị số trang với ellipsis
- Thay đổi số lượng item per page
- Thông tin tổng số kết quả

### 4. useLottery Hook
Custom hook quản lý state và API calls:
- Fetch dữ liệu từ API
- Quản lý loading state
- Build query string từ filters
- Handle authentication
- Error handling via toast notifications

## Usage

```tsx
import { useLottery } from '@/hooks/useLottery';
import LotteryFiltersComponent from '@/app/components/lottery/LotteryFilters';
import LotteryTable from '@/app/components/lottery/LotteryTable';
import LotteryPagination from '@/app/components/lottery/LotteryPagination';

const Lotterys = () => {
  const { data, pagination, loading, fetchLotteries } = useLottery();

  return (
    <div>
      <LotteryFiltersComponent onFiltersChange={fetchLotteries} />
      <LotteryTable data={data} loading={loading} />
      <LotteryPagination 
        pagination={pagination} 
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};
```

## API Integration

Components được thiết kế để tích hợp với API endpoint:
- `GET /api/v1/lotterys` - Lấy danh sách mã dự thưởng
- Hỗ trợ đầy đủ query parameters theo tài liệu API
- Authentication qua Cookie header

## Features

- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Copy to clipboard
- ✅ Date formatting (Vietnamese)
- ✅ Pagination với ellipsis
- ✅ Advanced filtering
- ✅ Sort functionality
- ✅ TypeScript support
