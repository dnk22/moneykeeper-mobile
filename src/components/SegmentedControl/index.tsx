import React, { memo } from 'react';
import SegmentedControl, {
  SegmentedControlProps,
} from '@react-native-segmented-control/segmented-control';
import isEqual from 'react-fast-compare';

function RNSegmentedControl({
  style,
  values,
  selectedIndex = 0,
  onChange,
  ...rest
}: SegmentedControlProps) {
  const onHandleChange = (event: any) => {
    onChange && onChange(event.nativeEvent.selectedSegmentIndex);
  };
  return (
    <SegmentedControl
      values={values}
      selectedIndex={selectedIndex}
      onChange={onHandleChange}
      {...rest}
    />
  );
}

export default memo(RNSegmentedControl, isEqual);
