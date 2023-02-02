import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import { ISwitchFieldProps } from './type';
import { Switch as RNSwitch } from 'react-native';
import { useCustomTheme } from 'resources/theme';

function SwitchField({
  name,
  control,
  style,
  ios_backgroundColor,
  trackColor,
  ...rest
}: ISwitchFieldProps) {
  const { colors } = useCustomTheme();
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });
  return (
    <RNSwitch
      ios_backgroundColor={ios_backgroundColor || '#3e3e3e'}
      trackColor={trackColor || { true: colors.primary }}
      onValueChange={onChange}
      style={[style]}
      value={value}
      {...rest}
    />
  );
}
export default memo(SwitchField, isEqual);
