import { memo, useEffect, useState, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import ModalComponent from 'components/Modal';
import DateTimePicker from 'components/DateTimePicker';
import PressableHaptic from 'components/PressableHaptic';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import { formatDateLocal } from 'utils/date';
import { getHours, getMinutes, getSeconds, set } from 'date-fns';
import styles from './styles';

interface DateTimeModalPickerProps {
  isVisible: boolean;
  value?: Date | number;
  dateMode?: boolean;
  onToggleModal: () => void;
  onDateTimePicker?: (date: Date) => void;
}

function DateTimeModalPicker({
  isVisible,
  dateMode = true,
  value,
  onToggleModal,
  onDateTimePicker,
}: DateTimeModalPickerProps) {
  const { colors } = useCustomTheme();

  const [datePicker, setDatePicker] = useState<Date>(value ? new Date(value) : new Date());
  const [isDateMode, setMode] = useState<boolean>(dateMode);
  const actionName = isDateMode ? 'Hôm nay' : 'Giờ hiện tại';

  useEffect(() => {
    if (isVisible) {
      setDatePicker(value ? new Date(value) : new Date());
      setMode(dateMode);
    }
  }, [isVisible, dateMode, value]);

  const onModalHide = () => {
    onDateTimePicker && onDateTimePicker(datePicker);
  };

  const onDateChange = useCallback((date?: Date) => {
    if (date) {
      setDatePicker(date);
    }
  }, []);

  const getCurrentDateTime = useCallback(() => {
    const now = new Date();
    setDatePicker((prevDate) => {
      const newValue = set(prevDate, {
        hours: isDateMode ? getHours(prevDate) : getHours(now),
        minutes: isDateMode ? getMinutes(prevDate) : getMinutes(now),
        seconds: getSeconds(prevDate),
      });
      return newValue;
    });
  }, [isDateMode]);

  return (
    <ModalComponent
      isVisible={isVisible}
      isShowClose={false}
      onToggleModal={onToggleModal}
      onModalHide={onModalHide}
      style={styles.container}
      styleDefaultContent={styles.contentView}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={[styles.pickerHeader, { backgroundColor: colors.surface }]}>
        <PressableHaptic style={styles.itemHeader} onPress={() => setMode(true)}>
          <RNText fontSize={18} color={isDateMode ? colors.primary : undefined}>
            {formatDateLocal(datePicker, 'dd/MM/yyyy')}
          </RNText>
        </PressableHaptic>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <PressableHaptic style={styles.itemHeader} onPress={() => setMode(false)}>
          <RNText fontSize={18} color={!isDateMode ? colors.primary : undefined}>
            {formatDateLocal(datePicker, 'HH:mm')}
          </RNText>
        </PressableHaptic>
      </View>
      <View style={[styles.pickerContent, { backgroundColor: colors.surface }]}>
        <View style={styles.dateTimePicker}>
          <DateTimePicker
            value={datePicker}
            onDateChange={onDateChange}
            mode={isDateMode ? 'date' : 'time'}
            display={isDateMode ? 'inline' : 'spinner'}
          />
        </View>
        <TouchableHighlightComponent style={styles.bottomBar} onPress={getCurrentDateTime}>
          <RNText>{actionName}</RNText>
        </TouchableHighlightComponent>
      </View>
      <View style={[styles.bright, styles.brightLeft, { backgroundColor: colors.primary }]} />
      <View style={[styles.bright, styles.brightRight, { backgroundColor: colors.primary }]} />
    </ModalComponent>
  );
}

export default memo(DateTimeModalPicker, isEqual);
