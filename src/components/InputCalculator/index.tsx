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
// import RnKeyboard from 'rn-keyboard';
import RNText from 'components/Text';
import styles from './styles';
import { Control, RegisterOptions, useController } from 'react-hook-form';
// import { CLEAR, PUSHSPECIALOPERATOR, SELECTIONCHANGE } from './type';

const operator = ['+', '-', '*', '/', ','];

type TInputCalculator = TextInputProps & {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<any, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  control: Control<any, any>;
  isShowPrefix?: boolean;
  inputTextColor?: string;
};

function InputCalculator({
  name,
  control,
  rules,
  onChangeText,
  isShowPrefix = true,
  inputTextColor = 'red',
}: TInputCalculator) {
  const { colors } = useCustomTheme();
  // const inputRef = useRef<ElementRef<typeof RnKeyboard.Input>>(null);
  const selection = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  // const [inputValue, setInputValue] = useState<string>(value);

  // useEffect(() => {
  //   RnKeyboard.addListener(CLEAR, () => {
  //     setInputValue('0');
  //   });
  //   return () => {
  //     RnKeyboard.addListener(CLEAR, () => {});
  //   };
  // }, []);

  const {
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control,
    rules,
  });

  const onHandleInputChange = (text?: any) => {
    // setInputValue(text);
    // onChangeText && onChangeText(inputValue);
  };

  const onHandleInputSelectionChange = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const {
      selection: { start, end },
    } = nativeEvent;
    selection.current = { start, end };
  };

  const onSubmitEditing = () => {};

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText style={styles.amountLabel}>Số tiền</RNText>
      <View style={styles.inputGroup}>
        <TextInput
          value={value}
          style={[styles.amountInput, { color: inputTextColor }]}
          onChangeText={onChange}
          keyboardType="numeric"
          selectTextOnFocus
          autoCorrect={false}
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
  );
}
export default memo(InputCalculator, isEqual);
