import { memo, useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Keyboard, TextInput, TextInputProps, View } from 'react-native';
import RNText from 'components/Text';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';
import { useCustomKeyboard } from 'libs/custom-keyboard/useCustomKeyboard';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

type TInputCalculator = TextInputProps & {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<any, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  isShowPrefix?: boolean;
  inputTextColor?: string;
  text?: string;
  replaceOnFirstKeyPress?: boolean;
};

function InputCalculator({
  name,
  rules,
  isShowPrefix = true,
  inputTextColor,
  text = 'Số tiền',
  replaceOnFirstKeyPress = true,
  ...props
}: TInputCalculator) {
  const { colors } = useCustomTheme();
  const { control } = useFormContext();
  const isScreenFocused = useIsFocused();
  const inputRef = useRef<TextInput>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const activeInputIdRef = useRef<string | undefined>(undefined);
  const { showKeyboard, hideKeyboard, activeInput } = useCustomKeyboard();
  const {
    field: { value = 0, onChange },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules,
  });
  const inputId = useMemo(() => `calculator-${name}`, [name]);

  const onFocusInput = () => {
    setIsInputFocused(true);
    showKeyboard({
      id: inputId,
      name,
      value,
      onChange: (nextValue: string) => onChange(nextValue),
      inputRef,
      keyboardType: 'calculator',
      replaceOnFirstKeyPress,
      onDismiss: () => Keyboard.dismiss(),
    });
  };

  const onBlurInput = () => {
    setIsInputFocused(false);
    if (!value) {
      onChange(0);
    }
  };
  const displayValue = String(value);

  useEffect(() => {
    activeInputIdRef.current = activeInput?.id;
  }, [activeInput?.id]);

  useEffect(() => {
    return () => {
      if (activeInputIdRef.current === inputId) {
        hideKeyboard({ blurInput: false, triggerDismiss: true });
      }
    };
  }, [hideKeyboard, inputId]);

  useEffect(() => {
    if (!isScreenFocused && activeInput?.id === inputId) {
      hideKeyboard({ blurInput: false, triggerDismiss: true });
    }
  }, [activeInput?.id, hideKeyboard, inputId, isScreenFocused]);

  useEffect(() => {
    if (!isInputFocused) {
      return;
    }

    inputRef.current?.setNativeProps({
      selection: {
        start: displayValue.length,
        end: displayValue.length,
      },
    });
  }, [displayValue, isInputFocused]);

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText preset="subTitle" style={styles.amountLabel}>
        {text}
      </RNText>
      <View style={styles.inputGroup}>
        <TextInput
          ref={inputRef}
          selectTextOnFocus={true}
          allowFontScaling={true}
          defaultValue={displayValue}
          value={displayValue}
          caretHidden={true}
          style={[
            styles.amountInput,
            {
              color: invalid ? 'red' : inputTextColor || colors.text,
            },
          ]}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          showSoftInputOnFocus={false}
          contextMenuHidden={true}
          {...props}
        />
        {isShowPrefix && (
          <RNText preset="subTitle" style={styles.currency}>
            ₫
          </RNText>
        )}
      </View>
    </View>
  );
}
export default memo(InputCalculator, isEqual);
