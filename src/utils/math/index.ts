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

export const formatNumber = (num: number | string, comma = '.') => {
  if (typeof num !== 'number' && typeof num !== 'string') {
    return 0;
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

export function formatThousandNumber(
  num: number,
  decimalSeparator: string,
  thousandSeparator: string,
): string {
  const nums = num.toString().split('.');
  const n = nums[0];

  const res = n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (v) => {
    return v + thousandSeparator;
  });

  return res + (nums.length > 1 ? decimalSeparator + nums[1] : '');
}

export const calculateValue = (value: string) => {
  // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]
  let numbers: any[] = value.split(/\+|\-|\×|\÷/g);

  // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
  // first we replace all the numbers and dot with empty string and then split
  let operators: string[] = value.replace(/[0-9]|\./g, '').split('');

  // now we are looping through the array and doing one operation at a time.
  // first divide, then multiply, then subtraction and then addition
  // as we move we are altering the original numbers and operators array
  // the final element remaining in the array will be the output

  let divide = operators.indexOf('÷');
  while (divide !== -1) {
    numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
    operators.splice(divide, 1);
    divide = operators.indexOf('÷');
  }

  let multiply = operators.indexOf('×');
  while (multiply !== -1) {
    numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
    operators.splice(multiply, 1);
    multiply = operators.indexOf('×');
  }

  let subtract = operators.indexOf('-');
  while (subtract !== -1) {
    numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
    operators.splice(subtract, 1);
    subtract = operators.indexOf('-');
  }

  let add = operators.indexOf('+');
  while (add !== -1) {
    // using parseFloat is necessary, otherwise it will result in string concatenation :)
    numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
    operators.splice(add, 1);
    add = operators.indexOf('+');
  }
  return numbers[0];
};
