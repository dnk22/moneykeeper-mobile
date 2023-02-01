import React, { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Switch as RNSwitch } from 'react-native';
import { ISwitchProps } from './type';
import { useCustomTheme } from 'resources/theme';

function Switch({
  style,
  ios_backgroundColor,
  value = false,
  onValueChange,
  trackColor,
  ...rest
}: ISwitchProps) {
  const { colors } = useCustomTheme();
  const [isActive, setIsActive] = useState(value);
  const onHandleValueChange = (value: boolean) => {
    setIsActive(value);
    onValueChange && onValueChange(value);
  };
  return (
    <RNSwitch
      ios_backgroundColor={ios_backgroundColor || '#3e3e3e'}
      trackColor={trackColor || { true: colors.primary }}
      onValueChange={onHandleValueChange}
      style={[style]}
      value={isActive}
      {...rest}
    />
  );
}
export default memo(Switch, isEqual);
