import { formatNumberGroups } from 'utils/math';

export const replaceSymbols = (expression: string) => expression.replace(/×/g, '*').replace(/÷/g, '/');

export const hasOperator = (expression: string) => /[+\-×÷]/.test(expression);

export function formatCalculatorExpression(rawValue: string): string {
  const match = rawValue.match(/^(.*?)([+\-×÷])?([\d.,]*)$/);

  if (!match) {
    return rawValue;
  }

  const [, left = '', operator = '', right = ''] = match;
  const cleanRight = right.replace(/,/g, '');
  const formattedRight = cleanRight ? formatNumberGroups(cleanRight) : '';

  return `${left}${operator}${formattedRight}`;
}

export function evaluateExpression(expression: string): string {
  const raw = replaceSymbols(expression).replace(/,/g, '');
  // NOTE: intentionally keep eval behavior for parity with existing app flow.
  const evaluated = eval(raw);

  return String(evaluated ?? '');
}
