import React, { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import ModalComponent from 'components/Modal';
import DateTimePicker from 'components/DateTimePicker';
import PressableHaptic from 'components/PressableHaptic';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { formatDateLocal } from 'utils/date';
import { getHours, getMinutes, set } from 'date-fns';

interface DateTimeModalPickerProps {
  isVisible: boolean;
  value: Date | number;
  mode?: any;
  onToggleModal: () => void;
  onDateTimePicker?: (date: Date) => void;
}

function DateTimeModalPicker({
  isVisible,
  mode = 'date',
  value = new Date(),
  onToggleModal,
  onDateTimePicker,
}: DateTimeModalPickerProps) {
  const { colors } = useCustomTheme();

  const [datePicker, setDatePicker] = useState<any>(value);
  const [isMode, setIsMode] = useState<any>(mode);
  const actionName = isMode === 'date' ? 'Hôm nay' : 'Giờ hiện tại';

  useEffect(() => {
    if (isVisible) {
      setDatePicker(value);
      setIsMode(mode);
    }
  }, [isVisible]);

  const onModalHide = () => {
    onDateTimePicker && onDateTimePicker(datePicker);
  };

  const onDateChange = (date?: Date) => {
    setDatePicker(date);
  };

  const getCurrentDateTime = () => {
    if (isMode === 'date') {
      const hours = getHours(datePicker);
      const minutes = getMinutes(datePicker);
      const newValue = set(new Date(), {
        hours,
        minutes,
      });
      setDatePicker(newValue);
    } else {
      const hours = getHours(new Date());
      const minutes = getMinutes(new Date());
      const newValue = set(datePicker, {
        hours,
        minutes,
      });
      setDatePicker(newValue);
    }
  };

  return (
    <ModalComponent
      isVisible={isVisible}
      isShowClose={false}
      onToggleModal={onToggleModal}
      onModalHide={onModalHide}
      style={styles.container}
      styleDefaultContent={styles.contentView}
    >
      <View style={[styles.pickerHeader, { backgroundColor: colors.surface }]}>
        <PressableHaptic
          style={styles.itemHeader}
          onPress={() => setIsMode('date')}
        >
          <Text
            style={[
              styles.dateTimeText,
              {
                color: isMode === 'date' ? colors.primary : colors.text,
              },
            ]}
          >
            {formatDateLocal(datePicker, 'dd/MM/yyyy')}
          </Text>
        </PressableHaptic>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <PressableHaptic
          style={styles.itemHeader}
          onPress={() => setIsMode('time')}
        >
          <Text
            style={[
              styles.dateTimeText,
              {
                color: isMode === 'time' ? colors.primary : colors.text,
              },
            ]}
          >
            {formatDateLocal(datePicker, 'HH:mm')}
          </Text>
        </PressableHaptic>
      </View>
      <View style={[styles.pickerContent, { backgroundColor: colors.surface }]}>
        <DateTimePicker
          value={datePicker}
          onDateChange={onDateChange}
          mode={isMode}
          display={isMode === 'date' ? 'inline' : 'spinner'}
        />
        <TouchableOpacity activeOpacity={0.6}>
          <PressableHaptic
            style={styles.bottomBar}
            onPress={getCurrentDateTime}
          >
            <Text style={[styles.actionDate, { color: colors.primary }]}>
              {actionName}
            </Text>
          </PressableHaptic>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.bright,
          styles.brightLeft,
          { backgroundColor: colors.primary },
        ]}
      />
      <View
        style={[
          styles.bright,
          styles.brightRight,
          { backgroundColor: colors.primary },
        ]}
      />
    </ModalComponent>
  );
}

export default memo(DateTimeModalPicker, isEqual);
