import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import RNDateTimePicker, {
  DateTimePickerEvent,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';

type RNDateTimePicker = IOSNativeProps;
export interface IDateTimePickerProps extends RNDateTimePicker {
  onDateChange?: (date?: Date) => void;
}

function DateTimePicker({
  onDateChange,
  mode = 'date',
  value,
  display,
  ...rest
}: IDateTimePickerProps) {
  const setDate = useCallback((event: DateTimePickerEvent, date?: Date) => {
    onDateChange && onDateChange(date);
  }, []);

  return (
    <RNDateTimePicker
      {...rest}
      value={new Date(value)}
      locale="vi"
      mode={mode}
      display={display}
      onChange={setDate}
    />
  );
}

export default memo(DateTimePicker, isEqual);
