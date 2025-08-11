import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import PressableHaptic from 'components/PressableHaptic';
import DateTimeModalPicker from 'components/DateTimeModalPicker';
import RNText from 'components/Text';
import { formatDateLocal } from 'utils/date';
import { Calendar2 } from 'iconsax-react-native';
import styles from './styles';

export type DateTimeSelectProps = {
  values: Date;
  onChangeDate: (value: Date) => void;
};
function DateTimeSelect({ values = new Date(), onChangeDate }: DateTimeSelectProps) {
  const [dateMode, setMode] = useState<boolean | undefined>(undefined);

  /** memoized function */
  const onToggleDateTimeModal = useCallback(
    (type?: boolean) => {
      setMode(type);
    },
    [dateMode],
  );

  return (
    <>
      <DateTimeModalPicker
        value={values}
        isVisible={dateMode === true || dateMode === false}
        dateMode={dateMode}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={onChangeDate}
      />
      <View style={styles.itemGroup}>
        <Calendar2 size="28" />
        <View style={styles.groupContent}>
          <PressableHaptic onPress={() => onToggleDateTimeModal(true)}>
            <RNText>{formatDateLocal(values, 'EEEE, dd/MM/yyyy')}</RNText>
          </PressableHaptic>
          <PressableHaptic style={styles.time} onPress={() => onToggleDateTimeModal(false)}>
            <RNText>{formatDateLocal(values, 'HH:mm')}</RNText>
          </PressableHaptic>
        </View>
      </View>
    </>
  );
}
export default DateTimeSelect;
