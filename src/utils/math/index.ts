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
  return Number(
    Math.round(Number(String(num + 'e' + decimals))) + 'e-' + decimals
  );
};

export const formatNumber = (num: number | string, comma = ',') => {
  if (typeof num !== 'number' && typeof num !== 'string') {
    return num;
  }
  return String(num).replace(/(\d)(?=(\d{3})+\b)/g, `$1${comma}`);
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


export function formatThousandNumber(num: number, decimalSeparator: string, thousandSeparator: string): string {
  const nums = num.toString().split('.');
  const n = nums[0];

  const res = n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (v) => {
    return v + thousandSeparator;
  });

  return res + (nums.length > 1 ? decimalSeparator + nums[1] : '');
}
