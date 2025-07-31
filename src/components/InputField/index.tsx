import React, { memo, forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';
import RNText from 'components/Text';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import stylesInline from './styles';

export interface IInputField extends TextInputProps {
  name: string;
  rules?: Omit<
    RegisterOptions<any, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  style?: StyleProp<TextStyle>;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  label?: string;
}

const InputField = forwardRef<TextInput, IInputField>(function InputField(
  { name, rules, style, clearButtonMode = 'always', label, ...rest },
  ref,
) {
  const { colors } = useCustomTheme();
  const { control } = useFormContext<any>();

  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <>
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
        placeholderTextColor={!invalid ? colors.textSecondary : colors.error}
        style={[stylesInline.input, style, { color: colors.text }]}
        onChangeText={onChange}
        onBlur={onBlur}
        clearButtonMode={clearButtonMode}
        {...rest}
      />
    </>
  );
});

export default memo(InputField, isEqual);
