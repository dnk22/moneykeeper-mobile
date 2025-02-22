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
  mode?: 'date' | 'time';
  onToggleModal: () => void;
  onDateTimePicker?: (date: Date) => void;
}

function DateTimeModalPicker({
  isVisible,
  mode = 'date',
  value,
  onToggleModal,
  onDateTimePicker,
}: DateTimeModalPickerProps) {
  const { colors } = useCustomTheme();

  const [datePicker, setDatePicker] = useState<Date>(value ? new Date(value) : new Date());
  const [isMode, setIsMode] = useState<'date' | 'time'>(mode);
  const actionName = isMode === 'date' ? 'Hôm nay' : 'Giờ hiện tại';

  useEffect(() => {
    if (isVisible) {
      setDatePicker(value ? new Date(value) : new Date());
      setIsMode(mode);
    }
  }, [isVisible, mode, value]);

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
        hours: isMode === 'date' ? getHours(prevDate) : getHours(now),
        minutes: isMode === 'date' ? getMinutes(prevDate) : getMinutes(now),
        seconds: getSeconds(prevDate),
      });
      return newValue;
    });
  }, [isMode]);

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
        <PressableHaptic style={styles.itemHeader} onPress={() => setIsMode('date')}>
          <RNText fontSize={18} color={isMode === 'date' ? colors.primary : undefined}>
            {formatDateLocal(datePicker, 'dd/MM/yyyy')}
          </RNText>
        </PressableHaptic>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <PressableHaptic style={styles.itemHeader} onPress={() => setIsMode('time')}>
          <RNText fontSize={18} color={isMode === 'time' ? colors.primary : undefined}>
            {formatDateLocal(datePicker, 'HH:mm')}
          </RNText>
        </PressableHaptic>
      </View>
      <View style={[styles.pickerContent, { backgroundColor: colors.surface }]}>
        <View style={styles.dateTimePicker}>
          <DateTimePicker
            value={datePicker}
            onDateChange={onDateChange}
            mode={isMode}
            display={isMode === 'date' ? 'inline' : 'spinner'}
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
