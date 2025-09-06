import * as XLSX from 'xlsx';
import { LotteryCode } from '@/types/lottery-types';

// Interface cho translations
export interface ExcelTranslations {
  headers: {
    stt: string;
    id: string;
    code: string;
    userName: string;
    telegramId: string;
    inputNumber: string;
    createdAt: string;
  };
  sheets: {
    lotteryData: string;
    statistics: string;
    detailedData: string;
  };
  stats: {
    title: string;
    totalCodes: string;
    usedCodes: string;
    remainingCodes: string;
    usageRate: string;
    exportDate: string;
  };
}

/**
 * Xuất dữ liệu lottery ra file Excel với hỗ trợ đa ngôn ngữ
 * @param data - Mảng dữ liệu lottery codes
 * @param filename - Tên file Excel (mặc định: 'lottery_data.xlsx')
 * @param translations - Object chứa các bản dịch cho Excel
 * @param locale - Locale để format ngày tháng (mặc định: 'vi-VN')
 */
export const exportToExcel = (
  data: LotteryCode[], 
  filename: string = 'lottery_data.xlsx',
  translations?: ExcelTranslations,
  locale: string = 'vi-VN'
) => {
  try {
    // Sử dụng translations mặc định nếu không được cung cấp
    const defaultTranslations: ExcelTranslations = {
      headers: {
        stt: 'STT',
        id: 'ID',
        code: 'Mã Code',
        inputNumber: 'Số nhập',
        userName: 'Tên User',
        telegramId: 'Telegram ID',
        createdAt: 'Ngày tạo'
      },
      sheets: {
        lotteryData: 'Lottery Data',
        statistics: 'Thống kê',
        detailedData: 'Dữ liệu chi tiết'
      },
      stats: {
        title: 'THỐNG KÊ TỔNG QUAN LOTTERY',
        totalCodes: 'Tổng số mã:',
        usedCodes: 'Đã sử dụng:',
        remainingCodes: 'Còn lại:',
        usageRate: 'Tỷ lệ sử dụng:',
        exportDate: 'Ngày xuất báo cáo:'
      }
    };

    const t = translations || defaultTranslations;

    // Chuẩn bị dữ liệu cho Excel
    const excelData = data.map((item, index) => ({
      [t.headers.stt]: index + 1,
      [t.headers.id]: item.id,
      [t.headers.code]: item.code,
      [t.headers.userName]: item.user.name,
      [t.headers.telegramId]: item.user.telegram_id,
      [t.headers.inputNumber]: item.input_number,
      [t.headers.createdAt]: new Date(item.created_at).toLocaleString(locale, {
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
      { wch: 25 },  // Tên User
      { wch: 15 },  // Telegram ID
      { wch: 10 },  // Số nhập
      { wch: 20 }   // Ngày tạo
    ];
    worksheet['!cols'] = columnWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, t.sheets.lotteryData);

    // Tạo file Excel và tải xuống
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    return false;
  }
};

/**
 * Xuất dữ liệu lottery với thống kê tổng quan và hỗ trợ đa ngôn ngữ
 * @param data - Mảng dữ liệu lottery codes
 * @param filename - Tên file Excel (mặc định: 'lottery_report.xlsx')
 * @param translations - Object chứa các bản dịch cho Excel
 * @param locale - Locale để format ngày tháng (mặc định: 'vi-VN')
 */
export const exportToExcelWithStats = (
  data: LotteryCode[], 
  filename: string = 'lottery_report.xlsx',
  translations?: ExcelTranslations,
  locale: string = 'vi-VN'
) => {
  try {
    // Sử dụng translations mặc định nếu không được cung cấp
    const defaultTranslations: ExcelTranslations = {
      headers: {
        stt: 'STT',
        id: 'ID',
        code: 'Mã Code',
        userName: 'Tên User',
        telegramId: 'Telegram ID',
        inputNumber: 'Số nhập',
        createdAt: 'Ngày tạo'
      },
      sheets: {
        lotteryData: 'Lottery Data',
        statistics: 'Thống kê',
        detailedData: 'Dữ liệu chi tiết'
      },
      stats: {
        title: 'THỐNG KÊ TỔNG QUAN LOTTERY',
        totalCodes: 'Tổng số mã:',
        usedCodes: 'Đã sử dụng:',
        remainingCodes: 'Còn lại:',
        usageRate: 'Tỷ lệ sử dụng:',
        exportDate: 'Ngày xuất báo cáo:'
      }
    };

    const t = translations || defaultTranslations;
    const workbook = XLSX.utils.book_new();

    // Tính toán thống kê
    const totalCodes = data.length;
    const usedCodes = data.filter(code => code.is_used).length;
    const availableCodes = totalCodes - usedCodes;
    const usageRate = totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : '0';

    // Tạo sheet thống kê
    const statsData = [
      [t.stats.title],
      [''],
      [t.stats.totalCodes, totalCodes],
      [t.stats.usedCodes, usedCodes],
      [t.stats.remainingCodes, availableCodes],
      [t.stats.usageRate, `${usageRate}%`],
      [''],
      [t.stats.exportDate, new Date().toLocaleString(locale)]
    ];

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, t.sheets.statistics);

    // Tạo sheet dữ liệu chi tiết
    const excelData = data.map((item, index) => ({
      [t.headers.stt]: index + 1,
      [t.headers.id]: item.id,
      [t.headers.code]: item.code,
      [t.headers.userName]: item.user.name,
      [t.headers.telegramId]: item.user.telegram_id,
      [t.headers.inputNumber]: item.input_number,
      [t.headers.createdAt]: new Date(item.created_at).toLocaleString(locale, {
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
      { wch: 25 },  // Tên User
      { wch: 15 },  // Telegram ID
      { wch: 10 },  // Số nhập
      { wch: 20 }   // Ngày tạo
    ];
    dataWorksheet['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, dataWorksheet, t.sheets.detailedData);

    // Tạo file Excel và tải xuống
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    return false;
  }
};
