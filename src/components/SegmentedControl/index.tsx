import React from 'react';
import SegmentedControl, {
  SegmentedControlProps,
} from '@react-native-segmented-control/segmented-control';
import { useCustomTheme } from 'resources/theme';

function RNSegmentedControl({
  style,
  values,
  selectedIndex = 0,
  onChange,
  ...rest
}: SegmentedControlProps) {
  const { colors } = useCustomTheme();
  const onHandleChange = (event: any) => {
    onChange && onChange(event.nativeEvent.selectedSegmentIndex);
  };
  return (
    <SegmentedControl
      style={style}
      values={values}
      selectedIndex={selectedIndex}
      onChange={onHandleChange}
      activeFontStyle={{ color: colors.primary }}
      {...rest}
    />
  );
}

export default RNSegmentedControl;
