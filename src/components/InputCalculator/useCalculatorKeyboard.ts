import { useCallback, useEffect, useState } from 'react';
import { BACKSPACE, CLEAR, DECIMAL, ENTER, NUMBER, OPERATOR, type ActionsProps } from './type';
import { evaluateExpression, formatCalculatorExpression } from './calculatorEngine';

type OnPushKeyboardEventProps = {
  value: string;
  type: ActionsProps | typeof NUMBER | typeof ENTER;
};

type UseCalculatorKeyboardParams = {
  value: string;
  onChange: (val: string) => void;
  onDone: () => void;
  replaceOnFirstKeyPress: boolean;
  onFirstKeyPressHandled?: () => void;
};

export function useCalculatorKeyboard({
  value,
  onChange,
  onDone,
  replaceOnFirstKeyPress,
  onFirstKeyPressHandled,
}: UseCalculatorKeyboardParams) {
  const [expression, setExpression] = useState<string>(value || '');

  useEffect(() => {
    setExpression(value || '');
  }, [value]);

  const updateValue = useCallback(
    (nextValue: string) => {
      const formatted = formatCalculatorExpression(nextValue);
      setExpression(formatted);
      onChange(formatted);
    },
    [onChange],
  );

  const onPushKeyboardEvent = useCallback(
    ({ value: inputValue, type }: OnPushKeyboardEventProps) => {
      let currentValue = expression;

      if (replaceOnFirstKeyPress && type !== ENTER) {
        currentValue = '';
      }

      if (replaceOnFirstKeyPress && type !== ENTER) {
        onFirstKeyPressHandled?.();
      }

      switch (type) {
        case CLEAR:
          updateValue('');
          return;
        case BACKSPACE:
          updateValue(currentValue.slice(0, -1));
          return;
        case OPERATOR:
          if (currentValue && !/[+\-×÷]$/.test(currentValue)) {
            updateValue(currentValue + inputValue);
          }
          return;
        case DECIMAL:
          updateValue(currentValue + '.');
          return;
        case NUMBER:
          updateValue(currentValue + inputValue);
          return;
        case ENTER:
          try {
            const evaluated = evaluateExpression(currentValue);
            updateValue(evaluated);
          } catch (_error) {
            updateValue('');
          }
          onDone();
          return;
        default:
          return;
      }
    },
    [expression, onDone, onFirstKeyPressHandled, replaceOnFirstKeyPress, updateValue],
  );

  return {
    expression,
    onPushKeyboardEvent,
  };
}
