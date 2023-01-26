import React, { ElementRef, memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputProps,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RnKeyboard from 'rn-keyboard';
import RNText from 'components/Text';
import styles from './styles';
import { CLEAR, PUSHSPECIALOPERATOR, SELECTIONCHANGE } from './type';

const operator = ['+', '-', '*', '/', ','];

type TInputCalculator = TextInputProps & {
  isShowPrefix?: boolean;
  inputTextColor?: string;
};

function InputCalculator({
  value = '0',
  onChangeText,
  isShowPrefix = true,
  inputTextColor = 'red',
}: TInputCalculator) {
  const { colors } = useCustomTheme();
  const inputRef = useRef<ElementRef<typeof RnKeyboard.Input>>(null);
  const selection = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    RnKeyboard.addListener(CLEAR, () => {
      setInputValue('0');
    });
    return () => {
      RnKeyboard.addListener(CLEAR, () => {});
    };
  }, []);

  const onHandleInputChange = (text?: any) => {
    setInputValue(text);
    onChangeText && onChangeText(inputValue);
  };

  const onHandleInputSelectionChange = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const {
      selection: { start, end },
    } = nativeEvent;
    selection.current = { start, end };
  };

  const onSubmitEditing = () => {
    const parseData = inputValue.replaceAll('.', '').replaceAll(',', '.');
    const result = eval(parseData);
    setInputValue(result.toString().replaceAll('.', ','));
  };

  return (
    <>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <RNText style={styles.amountLabel}>Số tiền</RNText>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.amountInput, { color: inputTextColor }]}
            onChangeText={onHandleInputChange}
            value={inputValue}
            keyboardType="numeric"
            selectTextOnFocus
            // showSoftInputOnFocus={false}
          />
          {/* <RnKeyboard.Input
          ref={inputRef}
          selectTextOnFocus
          value={inputValue}
          style={[styles.amountInput, { color: inputTextColor }]}
          rnKeyboardType={'KeyboardCalculator'}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onHandleInputChange}
          onSelectionChange={onHandleInputSelectionChange}
        /> */}
          {isShowPrefix && <Text style={styles.currency}>₫</Text>}
        </View>
      </View>
    </>
  );
}
export default memo(InputCalculator, isEqual);
