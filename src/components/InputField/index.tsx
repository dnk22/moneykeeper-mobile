import React, { memo, forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { Control, RegisterOptions, useController } from 'react-hook-form';
import RNText from 'components/Text';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import stylesInline from './styles';

export interface IInputField extends TextInputProps {
  name: string;
  control: Control<any>; // Có thể định nghĩa generics nếu bạn muốn rõ ràng hơn
  rules?: Omit<
    RegisterOptions<any, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  style?: StyleProp<TextStyle>;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  label?: string;
}

const InputField = forwardRef<TextInput, IInputField>(function InputField(
  { name, control, rules, style, clearButtonMode = 'always', label, ...rest },
  ref,
) {
  const { colors } = useCustomTheme();
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <View>
      {label && (
        <RNText style={stylesInline.label} fontSize={12} color={colors.textSecondary}>
          {label}
        </RNText>
      )}
      <TextInput
        ref={ref}
        value={value}
        autoCorrect={false}
        allowFontScaling={false}
        placeholderTextColor={colors.textSecondary}
        style={[stylesInline.input, style, { color: colors.text }]}
        onChangeText={onChange}
        onBlur={onBlur}
        clearButtonMode={clearButtonMode}
        {...rest}
      />
    </View>
  );
});

export default memo(InputField, isEqual);
