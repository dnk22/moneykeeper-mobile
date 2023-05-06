import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputProps,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import styles from './styles';
import { Control, RegisterOptions, useController } from 'react-hook-form';
import RnKeyboard from 'rn-keyboard';
import { CALCULATE, ISINCLUDEOPEARATORS, CLEAR, OPERATOR, NUMBER } from './type';
import { calculateValue, formatNumber } from 'utils/math';

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
    field: { value, onChange },
  } = useController({
    name,
    control,
    rules,
  });

  const cursorPosition = useRef<number>(0);
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const inputHasOperators = useMemo(() => {
    if (inputValue) {
      return (
        inputValue.includes('+') ||
        inputValue.includes('-') ||
        inputValue.includes('×') ||
        inputValue.includes('÷')
      );
    }
  }, [inputValue]);

  // set form value to input value
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // listen for clear event
  useEffect(() => {
    const clearEvent = RnKeyboard.addListener(CLEAR, () => {
      setInputValue('0');
    });
    return () => {
      clearEvent.remove();
    };
  }, []);

  // listen for calculate input value
  useEffect(() => {
    const calcEvent = RnKeyboard.addListener(CALCULATE, () => {
      const result = calculateValue(inputValue);
      setInputValue(result.toString());
    });
    return () => {
      calcEvent.remove();
    };
  }, [inputValue]);

  // listen for operators button pressed
  useEffect(() => {
    const operatorEvent = RnKeyboard.addListener(OPERATOR, async (operator: string) => {
      // if first key pressed is an operator, don't do anything
      if (!!!inputValue) return;
      const inputId = RnKeyboard.getFocusId();

      const leftInput = inputValue.slice(0, cursorPosition.current);
      const rightInput = inputValue.slice(cursorPosition.current);

      // if in left cursor, character entered is an operator, replace it with the currently pressed one
      if (isNaN(parseFloat(leftInput[leftInput.length - 1]))) {
        let newInputValue = '';
        newInputValue = leftInput.slice(0, leftInput.length - 1) + operator;
        setInputValue(newInputValue);
      } else {
        // else just add the operator pressed to the input
        await RnKeyboard.insert(inputId, operator);
      }
    });
    return () => {
      operatorEvent.remove();
    };
  }, [inputValue]);

  // listen for number button pressed
  useEffect(() => {
    const numberPressEvent = RnKeyboard.addListener(NUMBER, async (number) => {
      const inputId = RnKeyboard.getFocusId();
      // case : first number button press , input value = '0'
      if (inputValue === '0' || inputValue === '') {
        if (number === '0' || number === '000') {
          // case : if number pressed is '0' or '000' , replace value to '0' and return
          setInputValue('0');
          return;
        } else {
          // case : else is normal number, replace value with number without '0' in the first of value . eg : '0' => press '9' => '9' not '09'
          setInputValue(number);
          return;
        }
      }
      // case : keyboard insert event
      await RnKeyboard.insert(inputId, number);
    });
    return () => {
      numberPressEvent.remove();
    };
  }, [inputValue]);

  // action for change enter button in keyboard
  useEffect(() => {
    RnKeyboard.emit(ISINCLUDEOPEARATORS, inputHasOperators);
  }, [inputValue]);

  const onHandleInputChange = (text?: any) => {
    setInputValue(text);
    onChangeText && onChangeText(text);
    onChange(text);
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
    onChange(inputValue);
  };

  const formatText = useMemo(() => formatNumber(inputValue.replace(/,/g, '')), [inputValue]);

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText style={styles.amountLabel}>Số tiền</RNText>
      <View style={styles.inputGroup}>
        {/* <RnKeyboard.Input
          selectTextOnFocus
          allowFontScaling={false}
          rnKeyboardType={'KeyboardCalculator'}
          defaultValue={formatText}
          onChangeText={onHandleInputChange}
          onSelectionChange={handleOnSelectionChange}
          onBlur={handleOnBlurInput}
          style={[styles.amountInput, { color: inputTextColor }]}
        /> */}
        <TextInput
          selectTextOnFocus
          allowFontScaling={false}
          keyboardType="decimal-pad"
          value={value.toString()}
          style={[styles.amountInput, { color: inputTextColor }]}
          onChangeText={onHandleInputChange}
          onBlur={handleOnBlurInput}
        />
        {isShowPrefix && <RNText style={styles.currency}>₫</RNText>}
      </View>
    </View>
  );
}
export default memo(InputCalculator, isEqual);
