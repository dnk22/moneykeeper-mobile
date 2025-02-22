import React, { memo, forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import { Control, RegisterOptions, useController } from 'react-hook-form';
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
}

const InputField = forwardRef<TextInput, IInputField>(function InputField(
  { name, control, rules, style, clearButtonMode = 'always', ...rest },
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
    <TextInput
      ref={ref}
      value={value}
      autoCorrect={false}
      allowFontScaling={false}
      placeholderTextColor={error ? colors.error : colors.textSecondary}
      style={[stylesInline.input, style, { color: colors.text }]}
      onChangeText={onChange}
      onBlur={onBlur}
      clearButtonMode={clearButtonMode}
      {...rest}
    />
  );
});

export default memo(InputField, isEqual);
