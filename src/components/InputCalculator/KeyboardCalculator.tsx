import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TouchableHighlight from 'components/TouchableHighlight';
import { View } from 'react-native';
import styles from './styles';
import { CLEAR, ENTER, OPERATOR, BACKSPACE, DECIMAL, ActionsProps, NUMBER } from './type';
import Text from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { showToast } from 'utils/system';
import { formatNumberGroups } from 'utils/math';

type KeyboardCalculatorProps = {
  value: string;
  onChange: (val: string) => void;
  hasJustFocused: React.MutableRefObject<boolean>;
};

type onPushKeyboardEventProps = {
  value: string;
  type: ActionsProps | typeof NUMBER | typeof ENTER;
};

const replaceSymbols = (expression: string) => expression.replace(/×/g, '*').replace(/÷/g, '/');

function KeyboardCalculator({ value, onChange, hasJustFocused }: KeyboardCalculatorProps) {
  const { colors } = useCustomTheme();
  const [expression, setExpression] = useState<string>(value || '');

  useEffect(() => {
    setExpression(value || '');
  }, [value]);

  const updateValue = (val: string) => {
    // Tách expression theo toán tử cuối cùng
    const match = val.match(/^(.*?)([+\-×÷])?([\d.,]*)$/);

    if (!match) {
      setExpression(val);
      onChange(val);
      return;
    }

    const [, left = '', operator = '', right = ''] = match;

    // Xóa dấu phẩy cũ trước khi format
    const cleanRight = right.replace(/,/g, '');

    const formattedRight = cleanRight ? formatNumberGroups(cleanRight) : '';

    const formatted = `${left}${operator}${formattedRight}`;
    setExpression(formatted);
    onChange(formatted);
  };

  const onPushKeyboardEvent = useCallback(
    ({ value: inputValue, type }: onPushKeyboardEventProps) => {
      let val = expression;
      // Nếu vừa mới focus, reset giá trị để tránh lỗi hiển thị
      if (hasJustFocused.current) {
        hasJustFocused.current = false;
        val = '';
      }
      try {
        switch (type) {
          case CLEAR:
            updateValue('');
            break;
          case BACKSPACE:
            updateValue(val.slice(0, -1));
            break;
          case OPERATOR:
            if (val && !/[+\-×÷]$/.test(val)) {
              updateValue(val + inputValue);
            }
            break;
          case DECIMAL:
            updateValue(val + '.');
            break;
          case NUMBER:
            updateValue(val + inputValue);
            break;
          case ENTER:
            try {
              const raw = replaceSymbols(val).replace(/,/g, '');
              const evaluated = eval(raw);
              updateValue(evaluated.toString());
            } catch (err) {
              showToast({
                type: 'error',
                text2: 'Biểu thức không hợp lệ',
              });
              setExpression('');
            }
            break;
        }
      } catch (err) {}
    },
    [expression, hasJustFocused],
  );

  const EnterButton = () => {
    const isHasOperator = useMemo(() => /[+\-×÷]/.test(expression), [expression]);

    return (
      <TouchableHighlight
        style={[
          styles.enterButton,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
        onPress={() => onPushKeyboardEvent({ value: '=', type: ENTER })}
      >
        <Text>{isHasOperator ? '=' : 'Xong'}</Text>
      </TouchableHighlight>
    );
  };

  const renderButton = useCallback(
    (val: string, type: ActionsProps | typeof NUMBER, color?: any) => (
      <TouchableHighlight
        key={val}
        underlayColor={color ? colors.surface : colors.background}
        style={[styles.button, { borderColor: colors.border, backgroundColor: color }]}
        onPress={() => onPushKeyboardEvent({ value: val, type })}
      >
        <Text>{val}</Text>
      </TouchableHighlight>
    ),
    [onPushKeyboardEvent],
  );

  return (
    <View style={styles.keyBoardContainer}>
      <View style={styles.calcRow}>
        {renderButton('C', CLEAR, colors.background)}
        {renderButton('÷', OPERATOR, colors.background)}
        {renderButton('×', OPERATOR, colors.background)}
        {renderButton('⌫', BACKSPACE, colors.background)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('7', NUMBER)}
        {renderButton('8', NUMBER)}
        {renderButton('9', NUMBER)}
        {renderButton('-', OPERATOR, colors.background)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('4', NUMBER)}
        {renderButton('5', NUMBER)}
        {renderButton('6', NUMBER)}
        {renderButton('+', OPERATOR, colors.background)}
      </View>
      <View style={styles.calcRow}>
        <View style={{ flex: 3, gap: 4 }}>
          <View style={styles.calcRow}>
            {renderButton('1', NUMBER)}
            {renderButton('2', NUMBER)}
            {renderButton('3', NUMBER)}
          </View>
          <View style={styles.calcRow}>
            {renderButton('0', NUMBER)}
            {renderButton('000', NUMBER)}
            {renderButton('.', DECIMAL)}
          </View>
        </View>
        <EnterButton />
      </View>
    </View>
  );
}

export default KeyboardCalculator;
