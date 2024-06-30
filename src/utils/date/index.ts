import { format, isDate, parseISO, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

// define variable
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;
// const ONE_MONTH = 60 * 60 * 24 * 30;
// const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * format local date by date-fns
 */
export const formatDateLocal = (
  date: Date | number,
  formatType: string = 'dd/MM/yyyy',
  local: any = vi,
) => {
  if (!isDate(new Date()) || !date) return '';
  return format(new Date(date), formatType, { locale: local });
};

export const formatDayOfTheWeek = (date: any) => {
  if (isToday(parseISO(new Date(date).toISOString()))) {
    return 'Hôm nay';
  } else if (isYesterday(parseISO(new Date(date).toISOString()))) {
    return 'Hôm qua';
  }
  return formatDateLocal(date, 'EEEE');
};

export const formatDateStringLocal = (
  date: string,
  formatType: string = 'dd/MM/yyyy',
  local: any = vi,
) => {
  return format(parseISO(date), formatType, local);
};

export const isPassedDate = (date: string | Date | number) => {
  return new Date(date).getTime() <= new Date().getTime();
};
