import React, { useCallback, useMemo } from 'react';
import TouchableHighlight from 'components/TouchableHighlight';
import { View } from 'react-native';
import styles from './styles';
import { CLEAR, ENTER, OPERATOR, BACKSPACE, DECIMAL, ActionsProps, NUMBER } from './type';
import Text from 'components/Text';
import { hasOperator } from './calculatorEngine';
import { useCalculatorKeyboard } from './useCalculatorKeyboard';
import { CustomTheme } from 'resources/theme';

type KeyboardCalculatorProps = {
  value: string;
  onChange: (val: string) => void;
  onDone: () => void;
  colors: CustomTheme['colors'];
  replaceOnFirstKeyPress?: boolean;
  onFirstKeyPressHandled?: () => void;
};

function KeyboardCalculator({
  value,
  onChange,
  onDone,
  colors,
  replaceOnFirstKeyPress = false,
  onFirstKeyPressHandled,
}: KeyboardCalculatorProps) {
  const numberKeyBg = colors.surface;
  const operatorKeyBg = colors.operatorKeyBackground;
  const keyBorderColor = colors.border;
  const primaryTint = colors.primary;
  const operatorTextColor = colors.textSecondary;

  const { expression, onPushKeyboardEvent } = useCalculatorKeyboard({
    value,
    onChange,
    onDone,
    replaceOnFirstKeyPress,
    onFirstKeyPressHandled,
  });

  const EnterButton = () => {
    const isHasOperator = useMemo(() => hasOperator(expression), [expression]);

    return (
      <TouchableHighlight
        style={[styles.enterButton, { backgroundColor: primaryTint, borderColor: keyBorderColor }]}
        underlayColor={primaryTint}
        onPress={() => onPushKeyboardEvent({ value: '=', type: ENTER })}
      >
        <Text style={styles.doneText} color="white">
          {isHasOperator ? '=' : 'Xong'}
        </Text>
      </TouchableHighlight>
    );
  };

  const renderButton = useCallback(
    (val: string, type: ActionsProps | typeof NUMBER, isOperator = false) => (
      <TouchableHighlight
        key={val}
        underlayColor={isOperator ? numberKeyBg : operatorKeyBg}
        style={[
          styles.button,
          {
            borderColor: keyBorderColor,
            backgroundColor: isOperator ? operatorKeyBg : numberKeyBg,
          },
        ]}
        onPress={() => onPushKeyboardEvent({ value: val, type })}
      >
        <Text
          style={type === NUMBER || type === DECIMAL ? styles.numberText : styles.operatorText}
          color={colors.text}
        >
          {val}
        </Text>
      </TouchableHighlight>
    ),
    [
      colors.text,
      keyBorderColor,
      numberKeyBg,
      onPushKeyboardEvent,
      operatorKeyBg,
      operatorTextColor,
    ],
  );

  return (
    <View style={[styles.keyBoardContainer]}>
      <View style={styles.calcRow}>
        {renderButton('C', CLEAR, true)}
        {renderButton('÷', OPERATOR, true)}
        {renderButton('×', OPERATOR, true)}
        {renderButton('⌫', BACKSPACE, true)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('7', NUMBER)}
        {renderButton('8', NUMBER)}
        {renderButton('9', NUMBER)}
        {renderButton('+', OPERATOR, true)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('4', NUMBER)}
        {renderButton('5', NUMBER)}
        {renderButton('6', NUMBER)}
        {renderButton('-', OPERATOR, true)}
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
