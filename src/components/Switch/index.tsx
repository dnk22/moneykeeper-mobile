import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Switch as RNSwitch } from 'react-native';
import { ISwitchProps } from './type';
import { useCustomTheme } from 'resources/theme';

function Switch({
  style,
  ios_backgroundColor,
  value,
  onValueChange,
  trackColor,
  ...rest
}: ISwitchProps) {
  const { colors } = useCustomTheme();
  return (
    <RNSwitch
      ios_backgroundColor={ios_backgroundColor || '#3e3e3e'}
      trackColor={trackColor || { true: colors.primary }}
      onValueChange={onValueChange}
      style={[style]}
      value={value}
      {...rest}
    />
  );
}
export default memo(Switch, isEqual);
