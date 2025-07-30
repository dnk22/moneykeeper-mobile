export const NUMBER = 'NUMBER';
export const OPERATOR = 'OPERATOR';
export const BACKSPACE = 'BACKSPACE';
export const DECIMAL = 'DECIMAL';
export const CLEAR = 'CLEAR';
export const ENTER = 'ENTER';
export const CALCULATE = 'CALCULATE';

export type ActionsProps =
  | typeof NUMBER
  | typeof OPERATOR
  | typeof BACKSPACE
  | typeof DECIMAL
  | typeof CLEAR
  | typeof ENTER
  | typeof CALCULATE;
