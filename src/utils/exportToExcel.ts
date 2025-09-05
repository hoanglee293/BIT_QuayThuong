import * as XLSX from 'xlsx';
import { LotteryCode } from '@/types/lottery';

/**
 * Xuất dữ liệu lottery ra file Excel
 * @param data - Mảng dữ liệu lottery codes
 * @param filename - Tên file Excel (mặc định: 'lottery_data.xlsx')
 */
export const exportToExcel = (data: LotteryCode[], filename: string = 'lottery_data.xlsx') => {
  try {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = data.map((item, index) => ({
      'STT': index + 1,
      'ID': item.id,
      'Mã Code': item.code,
      'User ID': item.user_id,
      'Tên User': item.user.name,
      'Telegram ID': item.user.telegram_id,
      'Số nhập': item.input_number,
      'Trạng thái': item.is_used ? 'Đã sử dụng' : 'Chưa sử dụng',
      'Ngày tạo': new Date(item.created_at).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }));

    // Tạo workbook và worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Đặt độ rộng cột
    const columnWidths = [
      { wch: 5 },   // STT
      { wch: 10 },  // ID
      { wch: 20 },  // Mã Code
      { wch: 10 },  // User ID
      { wch: 25 },  // Tên User
      { wch: 15 },  // Telegram ID
      { wch: 10 },  // Số nhập
      { wch: 15 },  // Trạng thái
      { wch: 20 }   // Ngày tạo
    ];
    worksheet['!cols'] = columnWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lottery Data');

    // Tạo file Excel và tải xuống
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    return false;
  }
};

/**
 * Xuất dữ liệu lottery với thống kê tổng quan
 * @param data - Mảng dữ liệu lottery codes
 * @param filename - Tên file Excel (mặc định: 'lottery_report.xlsx')
 */
export const exportToExcelWithStats = (data: LotteryCode[], filename: string = 'lottery_report.xlsx') => {
  try {
    const workbook = XLSX.utils.book_new();

    // Tính toán thống kê
    const totalCodes = data.length;
    const usedCodes = data.filter(code => code.is_used).length;
    const availableCodes = totalCodes - usedCodes;
    const usageRate = totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : '0';

    // Tạo sheet thống kê
    const statsData = [
      ['THỐNG KÊ TỔNG QUAN LOTTERY'],
      [''],
      ['Tổng số mã:', totalCodes],
      ['Đã sử dụng:', usedCodes],
      ['Còn lại:', availableCodes],
      ['Tỷ lệ sử dụng:', `${usageRate}%`],
      [''],
      ['Ngày xuất báo cáo:', new Date().toLocaleString('vi-VN')]
    ];

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Thống kê');

    // Tạo sheet dữ liệu chi tiết
    const excelData = data.map((item, index) => ({
      'STT': index + 1,
      'ID': item.id,
      'Mã Code': item.code,
      'User ID': item.user_id,
      'Tên User': item.user.name,
      'Telegram ID': item.user.telegram_id,
      'Số nhập': item.input_number,
      'Trạng thái': item.is_used ? 'Đã sử dụng' : 'Chưa sử dụng',
      'Ngày tạo': new Date(item.created_at).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }));

    const dataWorksheet = XLSX.utils.json_to_sheet(excelData);
    const columnWidths = [
      { wch: 5 },   // STT
      { wch: 10 },  // ID
      { wch: 20 },  // Mã Code
      { wch: 10 },  // User ID
      { wch: 25 },  // Tên User
      { wch: 15 },  // Telegram ID
      { wch: 10 },  // Số nhập
      { wch: 15 },  // Trạng thái
      { wch: 20 }   // Ngày tạo
    ];
    dataWorksheet['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'Dữ liệu chi tiết');

    // Tạo file Excel và tải xuống
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    return false;
  }
};
