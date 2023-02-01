import React from 'react';
import SegmentedControl, {
  SegmentedControlProps,
} from '@react-native-segmented-control/segmented-control';

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
      style={[style]}
      values={values}
      selectedIndex={selectedIndex}
      onChange={onHandleChange}
      {...rest}
    />
  );
}

export default RNSegmentedControl;
