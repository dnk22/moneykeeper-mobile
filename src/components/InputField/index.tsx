import React, { memo, useEffect } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import { Control, RegisterOptions, useController } from 'react-hook-form';
import stylesInline from './styles';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';

interface IInputField extends TextInputProps {
  name: string;
  control: Control<any, any>;
  rules?:
    | Omit<
        RegisterOptions<any, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  style?: StyleProp<TextStyle> | any;
}
const InputField = React.forwardRef<any, any>(function InputField(
  { name, control, rules, style, ...rest }: IInputField,
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

  useEffect(()=> {
    
  },[error?.type])

  return (
    <TextInput
      ref={ref}
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      placeholderTextColor={error?.type ? 'red' : '#9999'}
      style={[stylesInline, style, { color: colors.text }]}
      {...rest}
      autoCorrect={false}
    />
  );
});
// function InputField({ name, control, rules, style, ...rest }: IInputField) {
//   const { colors } = useCustomTheme();
//   const inputRef = useRef(null);
//   const {
//     field: { value, onChange, onBlur },
//     fieldState: { error },
//   } = useController({
//     name,
//     control,
//     rules,
//   });

//   return (
//     <TextInput
//       ref={inputRef}
//       value={value}
//       onChangeText={onChange}
//       onBlur={onBlur}
//       placeholderTextColor={error?.type ? 'red' : '#9999'}
//       style={[stylesInline, style, { color: colors.text }]}
//       {...rest}
//     />
//   );
// }

export default memo(InputField, isEqual);
