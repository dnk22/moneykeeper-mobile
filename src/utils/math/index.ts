export const isNumber = (num: any): boolean => {
  return !isNaN(parseFloat(String(num)));
};

export const tryParseNumber = (num: any): any => {
  if (isNumber(num)) {
    return parseFloat(String(num));
  }
  return num;
};

export const roundMaxFixed = (num: number, decimals: number): number => {
  return Number(Math.round(Number(String(num + 'e' + decimals))) + 'e-' + decimals);
};

export const formatNumber = (
  num: number | string | undefined,
  isShowPrefix = false,
  comma = '.',
) => {
  if (num === undefined || num === null) {
    return `0${isShowPrefix ? ' ₫' : ''}`;
  }
  if (typeof num !== 'number' && typeof num !== 'string') {
    return `0${isShowPrefix ? ' ₫' : ''}`;
  }
  return String(num).replace(/(\d)(?=(\d{3})+\b)/g, `$1${comma}`) + `${isShowPrefix ? ' ₫' : ''}`;
};

/**
 * Return true, if @param n is valid number
 *
 * @param n is number
 */
export function isNonEmptyNumber(n: number | undefined | null) {
  if (n === undefined || n == null) {
    return false;
  }
  return true;
}

export const formatNumberGroups = (val: string) => {
  // Format từng nhóm số sau các toán tử
  return val.replace(/\d+/g, (match) => {
    if (match.length <= 3) return match;
    return match.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  });
};
