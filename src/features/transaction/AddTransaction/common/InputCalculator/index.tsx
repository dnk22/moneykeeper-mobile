import { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Keyboard, TextInput, TextInputProps, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import styles from './styles';
import { Control, RegisterOptions, useController, useFormContext } from 'react-hook-form';
import KeyboardCalculator from './KeyboardCalculator';
import BottomSheet from 'components/BottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

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
  rules,
  onChangeText,
  isShowPrefix = true,
  inputTextColor,
  text = 'Số tiền',
}: TInputCalculator) {
  const { colors } = useCustomTheme();
  const { control } = useFormContext();
  const {
    field: { value = 0, onChange },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules,
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const onFocusInput = () => {
    bottomSheetRef.current?.present();
  };

  const onDismiss = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.dismiss();
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <RNText preset="subTitle" style={styles.amountLabel}>
        {text}
      </RNText>
      <View style={styles.inputGroup}>
        <TextInput
          selectTextOnFocus
          allowFontScaling={false}
          value={value}
          style={[
            styles.amountInput,
            {
              color: invalid ? colors.error : inputTextColor || colors.primary,
            },
          ]}
          onFocus={onFocusInput}
          showSoftInputOnFocus={false}
        />
        {isShowPrefix && (
          <RNText preset="subTitle" style={styles.currency}>
            ₫
          </RNText>
        )}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enableOverDrag={false}
        enablePanDownToClose
        // disabledBackdrop
        backdropColor="transparent"
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        onDismiss={onDismiss}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        style={[{ backgroundColor: colors.surface }]}
        backgroundColor={colors.surface}
      >
        <KeyboardCalculator value={value} onChange={onChange} />
      </BottomSheet>
    </View>
  );
}
export default memo(InputCalculator, isEqual);
