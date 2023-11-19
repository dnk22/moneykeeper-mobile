import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import SvgIcon from 'components/SvgIcon';
import PressableHaptic from 'components/PressableHaptic';
import { DateTimeModalPicker, RNText } from 'components/index';
import { formatDateLocal } from 'utils/date';

export type DateTimeSelectProps = {
  values: Date;
  onChangeDate: (value: Date) => void;
};
function DateTimeSelect({ values = new Date(), onChangeDate }: DateTimeSelectProps) {
  const [isDateTimeModalType, setIsDateTimeModalType] = useState<'date' | 'time' | undefined>(
    undefined,
  );

  /** memoized function */
  const onToggleDateTimeModal = useCallback(
    (type?: 'date' | 'time') => {
      setIsDateTimeModalType(type);
    },
    [isDateTimeModalType],
  );

  return (
    <>
      <DateTimeModalPicker
        value={values}
        isVisible={isDateTimeModalType === 'date' || isDateTimeModalType === 'time'}
        mode={isDateTimeModalType}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={onChangeDate}
      />
      <View style={styles.itemGroup}>
        <SvgIcon name="calendarHoliday" color='#adb5bd' />
        <View style={styles.groupContent}>
          <PressableHaptic onPress={() => onToggleDateTimeModal('date')}>
            <RNText>{formatDateLocal(values, 'EEEE, dd/MM/yyyy')}</RNText>
          </PressableHaptic>
          <PressableHaptic style={styles.time} onPress={() => onToggleDateTimeModal('time')}>
            <RNText>{formatDateLocal(values, 'HH:mm')}</RNText>
          </PressableHaptic>
        </View>
      </View>
    </>
  );
}
export default DateTimeSelect;
