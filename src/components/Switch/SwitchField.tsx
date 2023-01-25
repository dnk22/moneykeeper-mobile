import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import Switch from '.';
import { ISwitchFieldProps } from './type';

function SwitchField({ name, control, ...rest }: ISwitchFieldProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });
  return <Switch onValueChange={onChange} value={value} {...rest} />;
}
export default memo(SwitchField, isEqual);
