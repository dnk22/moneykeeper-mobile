import { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Keyboard, TextInput, TextInputProps, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';
import KeyboardCalculator from './KeyboardCalculator';
import BottomSheet, { TrueSheet } from 'components/BottomSheetModal';
import styles from './styles';

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
};

const snapPoints = ['40%'];

function InputCalculator({
  name,
  isShowPrefix = true,
  inputTextColor,
  text = 'Số tiền',
  ...props
}: TInputCalculator) {
  const { colors } = useCustomTheme();
  const { control } = useFormContext();
  const {
    field: { value = 0, onChange },
    fieldState: { invalid },
  } = useController({
    name,
    control,
  });

  const bottomSheetRef = useRef<TrueSheet>(null);
  const hasJustFocused = useRef(false);

  const onFocusInput = () => {
    hasJustFocused.current = true;
    bottomSheetRef.current?.present();
  };

  const onDismiss = () => {
    hasJustFocused.current = false;
    Keyboard.dismiss();
    bottomSheetRef.current?.dismiss();
  };

  const onBlurInput = () => {
    if (!value) {
      onChange(0);
    }
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText preset="subTitle" style={styles.amountLabel}>
        {text}
      </RNText>
      <View style={styles.inputGroup}>
        <TextInput
          selectTextOnFocus
          allowFontScaling={true}
          defaultValue={String(value)}
          value={String(value)}
          style={[
            styles.amountInput,
            {
              color: invalid ? colors.error : inputTextColor || colors.primary,
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
      <BottomSheet
        ref={bottomSheetRef}
        detents={['auto']}
        backgroundColor={colors.surface}
        // dimmed={false}
        grabber={false}
        onDismiss={onDismiss}
        modalContainerStyle={styles.modalContainer}
      >
        <KeyboardCalculator
          value={value}
          onChange={onChange}
          hasJustFocused={hasJustFocused}
          onDismiss={onDismiss}
        />
      </BottomSheet>
    </View>
  );
}
export default memo(InputCalculator, isEqual);
