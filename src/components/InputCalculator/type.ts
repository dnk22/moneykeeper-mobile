export const ENTER = 'Enter';
export const PLUS = '+';
export const MINUS = '-';
export const DIVIDE = '/';
export const MULTIPLY = '*';

export const NUMBER = 'number';
export const OPERATOR = 'operator';
export const BACKSPACE = '⌫';
export const DECIMAL = ',';
export const CLEAR = 'C';

export type ActionsProps =
  | typeof OPERATOR
  | typeof BACKSPACE
  | typeof CLEAR
  | typeof DECIMAL
  | typeof ENTER;

export const ISINCLUDEOPEARATORS = 'isIncludeOperators';
export const CALCULATE = 'calculate';
