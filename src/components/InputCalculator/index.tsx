import React, {
  ElementRef,
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import {
  NativeSyntheticEvent,
  Text,
  TextInputProps,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import styles from './styles';
import { Control, RegisterOptions, useController } from 'react-hook-form';
import RnKeyboard from 'rn-keyboard';
import { CALCULATE, CHANGESUBMIT, CLEAR, OPERATOR } from './type';

// const operator = ['+', '-', '*', '/', ','];

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
  const {
    field: { value = 0, onChange },
  } = useController({
    name,
    control,
    rules,
  });

  const inputRef = useRef<ElementRef<typeof RnKeyboard.Input>>(null);
  const cursorPosition = useRef<number>(0);
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const inputHasOperators = useMemo(() => {
    return (
      inputValue.includes('+') ||
      inputValue.includes('-') ||
      inputValue.includes('*') ||
      inputValue.includes('/')
    );
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    const clearEvent = RnKeyboard.addListener(CLEAR, () => {
      setInputValue('0');
    });
    return () => {
      clearEvent.remove();
    };
  }, []);

  useEffect(() => {
    const calcEvent = RnKeyboard.addListener(CALCULATE, () => {
      setInputValue(String(eval(inputValue)));
    });
    return () => {
      calcEvent.remove();
    };
  }, [inputValue]);

  useEffect(() => {
    RnKeyboard.emit(CHANGESUBMIT, inputHasOperators);
  }, [inputValue]);

  useEffect(() => {
    const operatorEvent = RnKeyboard.addListener(OPERATOR, async (operator: string) => {
      const inputId = RnKeyboard.getFocusId();
      const leftInput = inputValue.slice(0, cursorPosition.current);
      const rightInput = inputValue.slice(cursorPosition.current);
      let newInputValue = '';
      if (isNaN(parseFloat(leftInput[leftInput.length - 1]))) {
        newInputValue = leftInput.slice(0, leftInput.length - 1) + operator;
      } else {
        await RnKeyboard.insert(inputId, operator);
        return;
      }
      setInputValue(newInputValue);
    });
    return () => {
      operatorEvent.remove();
    };
  }, [inputValue]);

  const onHandleInputChange = (text?: any) => {
    const formattedText = text
      ? text.replace(/[.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : text;
    setInputValue(formattedText);
    onChangeText && onChangeText(inputValue);
  };

  const handleOnSelectionChange = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const {
      selection: { start },
    } = nativeEvent;
    cursorPosition.current = start;
  };

  const handleOnBlurInput = () => {
    if (!Boolean(inputValue)) {
      setInputValue('0');
    }
  };

  const onSubmitEditing = () => {};

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText style={styles.amountLabel}>Số tiền</RNText>
      <View style={styles.inputGroup}>
        {/* <TextInput
          value={value}
          style={[styles.amountInput, { color: inputTextColor }]}
          onChangeText={onChange}
          keyboardType="numeric"
          selectTextOnFocus
          autoCorrect={false}
          // showSoftInputOnFocus={false}
        /> */}
        <RnKeyboard.Input
          ref={inputRef}
          selectTextOnFocus
          value={inputValue}
          style={[styles.amountInput, { color: inputTextColor }]}
          rnKeyboardType={'KeyboardCalculator'}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onHandleInputChange}
          onSelectionChange={handleOnSelectionChange}
          onBlur={handleOnBlurInput}
        />
        {isShowPrefix && <Text style={styles.currency}>₫</Text>}
      </View>
    </View>
  );
}
export default memo(InputCalculator, isEqual);
