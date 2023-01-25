import React, { memo } from 'react';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import isEqual from 'react-fast-compare';
import { ISegmentedControlFieldProps } from './type';
import { useController } from 'react-hook-form';

function SegmentedControlField({
  name,
  control,
  style,
  values,
  ...rest
}: ISegmentedControlFieldProps) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });
  return (
    <SegmentedControl
      style={[style]}
      values={values}
      selectedIndex={value}
      onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)}
      {...rest}
    />
  );
}

export default memo(SegmentedControlField, isEqual);
