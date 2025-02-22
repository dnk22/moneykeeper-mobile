import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import RNDateTimePicker, {
  DateTimePickerEvent,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';

type DateTimePickerProps = IOSNativeProps;

export interface IDateTimePickerProps extends DateTimePickerProps {
  onDateChange?: (date?: Date) => void;
}

function DateTimePicker({
  onDateChange,
  mode = 'date',
  value,
  display = 'default',
  locale = 'vi',
  ...rest
}: IDateTimePickerProps) {
  const setDate = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (event.type !== 'dismissed') {
        onDateChange && onDateChange(date ?? new Date());
      }
    },
    [onDateChange]
  );

  return (
    <RNDateTimePicker
      {...rest}
      value={value ? new Date(value) : new Date()}
      locale={locale}
      mode={mode}
      display={display}
      onChange={setDate}
    />
  );
}

export default memo(DateTimePicker, isEqual);
