import { format, Locale } from 'date-fns';
import { vi, enUS, ko, ja } from 'date-fns/locale';
import { LangCodes } from '@/lang';

// Mapping múi giờ cho từng quốc gia
const TIMEZONE_MAP: Record<LangCodes, string> = {
  'vi': 'Asia/Ho_Chi_Minh', // UTC+7
  'en': 'America/New_York', // UTC-5 (EST) hoặc UTC-4 (EDT)
  'kr': 'Asia/Seoul', // UTC+9
  'jp': 'Asia/Tokyo', // UTC+9
};

// Mapping locale cho date-fns
const LOCALE_MAP: Record<LangCodes, Locale> = {
  'vi': vi,
  'en': enUS,
  'kr': ko,
  'jp': ja,
};

// Format patterns cho từng quốc gia (không bao gồm timezone)
const DATE_FORMAT_PATTERNS: Record<LangCodes, string> = {
  'vi': 'dd/MM/yyyy HH:mm', // 25/12/2023 14:30
  'en': 'MM/dd/yyyy h:mm a', // 12/25/2023 2:30 PM
  'kr': 'yyyy.MM.dd HH:mm', // 2023.12.25 14:30
  'jp': 'yyyy/MM/dd HH:mm', // 2023/12/25 14:30
};

// Format patterns với timezone offset
const DATE_FORMAT_PATTERNS_WITH_TIMEZONE: Record<LangCodes, string> = {
  'vi': 'dd/MM/yyyy HH:mm (UTC+7)', // 25/12/2023 14:30 (UTC+7)
  'en': 'MM/dd/yyyy h:mm a (UTC-5)', // 12/25/2023 2:30 PM (UTC-5)
  'kr': 'yyyy.MM.dd HH:mm (UTC+9)', // 2023.12.25 14:30 (UTC+9)
  'jp': 'yyyy/MM/dd HH:mm (UTC+9)', // 2023/12/25 14:30 (UTC+9)
};

/**
 * Format date theo múi giờ và locale của quốc gia được chọn
 * @param dateString - Chuỗi ngày tháng cần format
 * @param lang - Mã ngôn ngữ quốc gia
 * @param customFormat - Format tùy chỉnh (optional)
 * @returns Chuỗi ngày tháng đã được format
 */
export const formatDateByLang = (
  dateString: string | Date, 
  lang: LangCodes, 
  customFormat?: string
): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) {
      return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }

    const locale = LOCALE_MAP[lang] || enUS;
    const formatPattern = customFormat || DATE_FORMAT_PATTERNS[lang] || DATE_FORMAT_PATTERNS['en'];
    
    return format(date, formatPattern, { locale });
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof dateString === 'string' ? dateString : 'Invalid Date';
  }
};

/**
 * Format date với múi giờ cụ thể và hiển thị timezone offset
 * @param dateString - Chuỗi ngày tháng cần format
 * @param lang - Mã ngôn ngữ quốc gia
 * @param timezone - Múi giờ cụ thể (optional, sẽ dùng múi giờ mặc định của quốc gia)
 * @param showTimezone - Hiển thị timezone offset (default: true)
 * @returns Chuỗi ngày tháng đã được format với múi giờ
 */
export const formatDateWithTimezone = (
  dateString: string | Date,
  lang: LangCodes,
  timezone?: string,
  showTimezone: boolean = true
): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return typeof dateString === 'string' ? dateString : 'Invalid Date';
    }

    const targetTimezone = timezone || TIMEZONE_MAP[lang] || 'UTC';
    const locale = LOCALE_MAP[lang] || enUS;

    // Sử dụng Intl.DateTimeFormat để format theo múi giờ
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: lang === 'en', // Chỉ sử dụng 12h format cho tiếng Anh
    });

    const parts = formatter.formatToParts(date);
    const year = parts.find(part => part.type === 'year')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const day = parts.find(part => part.type === 'day')?.value;
    const hour = parts.find(part => part.type === 'hour')?.value;
    const minute = parts.find(part => part.type === 'minute')?.value;
    const dayPeriod = parts.find(part => part.type === 'dayPeriod')?.value;

    // Lấy timezone offset
    let timezoneOffset = '';
    if (showTimezone) {
      try {
        const offsetFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: targetTimezone,
          timeZoneName: 'longOffset'
        });
        const offsetParts = offsetFormatter.formatToParts(date);
        timezoneOffset = offsetParts.find(part => part.type === 'timeZoneName')?.value || '';
      } catch {
        // Fallback cho timezone offset
        const offsetMap: Record<LangCodes, string> = {
          'vi': 'UTC+7',
          'en': 'UTC-5', // EST, có thể thay đổi theo mùa
          'kr': 'UTC+9',
          'jp': 'UTC+9',
        };
        timezoneOffset = ` (${offsetMap[lang] || 'UTC'})`;
      }
    }

    // Format theo pattern của từng quốc gia
    let formattedDate = '';
    switch (lang) {
      case 'vi':
        formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
        break;
      case 'en':
        formattedDate = `${month}/${day}/${year} ${hour}:${minute} ${dayPeriod || ''}`.trim();
        break;
      case 'kr':
        formattedDate = `${year}.${month}.${day} ${hour}:${minute}`;
        break;
      case 'jp':
        formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;
        break;
      default:
        formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
    }

    return showTimezone ? `${formattedDate} ${timezoneOffset}` : formattedDate;
  } catch (error) {
    console.error('Error formatting date with timezone:', error);
    return typeof dateString === 'string' ? dateString : 'Invalid Date';
  }
};

/**
 * Format date với timezone offset hiển thị rõ ràng
 * @param dateString - Chuỗi ngày tháng cần format
 * @param lang - Mã ngôn ngữ quốc gia
 * @returns Chuỗi ngày tháng đã được format với timezone offset
 */
export const formatDateWithOffset = (
  dateString: string | Date,
  lang: LangCodes
): string => {
  return formatDateWithTimezone(dateString, lang, undefined, true);
};

/**
 * Lấy múi giờ hiện tại của quốc gia
 * @param lang - Mã ngôn ngữ quốc gia
 * @returns Múi giờ của quốc gia
 */
export const getTimezoneByLang = (lang: LangCodes): string => {
  return TIMEZONE_MAP[lang] || 'UTC';
};

/**
 * Lấy thông tin múi giờ hiện tại
 * @param lang - Mã ngôn ngữ quốc gia
 * @returns Object chứa thông tin múi giờ
 */
export const getTimezoneInfo = (lang: LangCodes) => {
  const timezone = TIMEZONE_MAP[lang] || 'UTC';
  const now = new Date();
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || timezone;
    
    return {
      timezone,
      timeZoneName,
      offset: timeZoneName,
      currentTime: formatDateWithTimezone(now, lang)
    };
  } catch (error) {
    return {
      timezone,
      timeZoneName: timezone,
      offset: 'Unknown',
      currentTime: 'Error'
    };
  }
};
