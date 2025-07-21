import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TouchableHighlight from 'components/TouchableHighlight';
import { Text, View } from 'react-native';
import styles from './styles';
import {
  CLEAR,
  ENTER,
  OPERATOR,
  BACKSPACE,
  DECIMAL,
  ActionsProps,
  NUMBER,
} from './type';

type KeyboardCalculatorProps = {
  value: string;
  onChange: (val: string) => void;
};

type onPushKeyboardEventProps = {
  value: string;
  type: ActionsProps | typeof NUMBER | typeof ENTER;
};

function KeyboardCalculator({ value, onChange }: KeyboardCalculatorProps) {
  const [expression, setExpression] = useState<string>(value || '');

  useEffect(() => {
    setExpression(value || '');
  }, [value]);

  const updateValue = (val: string) => {
    setExpression(val);
    onChange(val);
  };

  const onPushKeyboardEvent = useCallback(
    ({ value: inputValue, type }: onPushKeyboardEventProps) => {
      try {
        switch (type) {
          case CLEAR:
            updateValue('');
            break;
          case BACKSPACE:
            updateValue(expression.slice(0, -1));
            break;
          case OPERATOR:
            if (expression && !/[+\-×÷]$/.test(expression)) {
              updateValue(expression + inputValue);
            }
            break;
          case DECIMAL:
            updateValue(expression + '.');
            break;
          case NUMBER:
            updateValue(expression + inputValue);
            break;
          case ENTER:
            try {
              const evaluated = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
              updateValue(evaluated.toString());
            } catch (err) {
              // do nothing or notify invalid expression
            }
            break;
        }
      } catch (err) {
        // @todo handle error
      }
    },
    [expression],
  );

  const renderButton = useCallback(
    (val: string, type: ActionsProps | typeof NUMBER) => (
      <TouchableHighlight
        key={val}
        style={styles.button}
        onPress={() => onPushKeyboardEvent({ value: val, type })}
      >
        <Text>{val}</Text>
      </TouchableHighlight>
    ),
    [onPushKeyboardEvent],
  );

  const EnterButton = () => {
    const isHasOperator = useMemo(() => /[+\-×÷]/.test(expression), [expression]);

    const onEnter = () => {
      onPushKeyboardEvent({ value: '=', type: ENTER });
    };

    return (
      <TouchableHighlight style={styles.enterButton} onPress={onEnter}>
        <Text>{isHasOperator ? '=' : 'Xong'}</Text>
      </TouchableHighlight>
    );
  };

  return (
    <View>
      <View style={styles.calcRow}>
        {renderButton('C', CLEAR)}
        {renderButton('÷', OPERATOR)}
        {renderButton('×', OPERATOR)}
        {renderButton('⌫', BACKSPACE)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('7', NUMBER)}
        {renderButton('8', NUMBER)}
        {renderButton('9', NUMBER)}
        {renderButton('-', OPERATOR)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('4', NUMBER)}
        {renderButton('5', NUMBER)}
        {renderButton('6', NUMBER)}
        {renderButton('+', OPERATOR)}
      </View>
      <View style={styles.calcRow}>
        <View style={{ flex: 3 }}>
          <View style={styles.calcRow}>
            {renderButton('1', NUMBER)}
            {renderButton('2', NUMBER)}
            {renderButton('3', NUMBER)}
          </View>
          <View style={styles.calcRow}>
            {renderButton('0', NUMBER)}
            {renderButton('000', NUMBER)}
            {renderButton(',', DECIMAL)}
          </View>
        </View>
        <EnterButton />
      </View>
    </View>
  );
}

export default KeyboardCalculator;
