import React, { useState } from 'react';
import { Button, Pressable, View } from 'react-native';
import RNText from 'components/Text';
import DateTimePicker from 'components/DateTimePicker';
import SvgIcon from 'components/SvgIcon';
import ModalComponent from 'components/Modal';

import { Picker } from '@react-native-picker/picker';
import { VIEW_EXPENSE_INCOME_REPORT_BY } from 'utils/constants';
import { formatDateLocal } from 'utils/date';
import styles from './styles';

export type DateProps = { startDate: number | Date; endDate: number | Date };
const YearRange = () => {
  const result = [];
  for (let index = 1970; index < 2100; index++) {
    result.push(index);
  }
  return result;
};

function DateFilter({
  value,
  colors,
  type,
  onChange,
}: {
  value: DateProps;
  colors: any;
  type: VIEW_EXPENSE_INCOME_REPORT_BY;
  onChange: ({}) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const formatDate = type === VIEW_EXPENSE_INCOME_REPORT_BY.FREE ? 'dd/MM/yyyy' : 'yyyy';
  const [dateTemp, setDateTemp] = useState(value.startDate);

  const onToggleModal = () => {
    setIsVisible(!isVisible);
  };

  const onValueChange = () => {};

  const onDone = () => {
    onToggleModal();
  };

  return (
    <>
      <Pressable
        style={[styles.header, styles.row, { backgroundColor: colors.surface }]}
        onPress={onToggleModal}
      >
        <View style={styles.row}>
          <SvgIcon name="calendarHoliday" color="gray" />
          <View style={styles.dateView}>
            <RNText preset="modalTitle">{formatDateLocal(value.startDate, formatDate)}</RNText>
            {[VIEW_EXPENSE_INCOME_REPORT_BY.FREE, VIEW_EXPENSE_INCOME_REPORT_BY.YEAR].includes(
              type,
            ) && (
              <>
                <RNText> - </RNText>
                <RNText preset="modalTitle">{formatDateLocal(value.endDate, formatDate)}</RNText>
              </>
            )}
          </View>
        </View>
      </Pressable>
      <ModalComponent
        style={styles.modalContainer}
        styleDefaultContent={styles.modalInnerView}
        isVisible={isVisible}
        isShowClose={false}
        onToggleModal={onToggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        disableCloseOnPressBackDrop
      >
        <View style={[styles.modalTitle, { borderColor: colors.divider }]}>
          <RNText preset="modalTitle">{formatDateLocal(value.startDate, formatDate)}</RNText>
          {[VIEW_EXPENSE_INCOME_REPORT_BY.FREE, VIEW_EXPENSE_INCOME_REPORT_BY.YEAR].includes(
            type,
          ) && (
            <>
              <RNText> - </RNText>
              <RNText preset="modalTitle">{formatDateLocal(value.endDate, formatDate)}</RNText>
            </>
          )}
        </View>
        {type === VIEW_EXPENSE_INCOME_REPORT_BY.FREE ? (
          <DateTimePicker
            minimumDate={new Date(dateTemp)}
            value={new Date(dateTemp)}
            onDateChange={() => {}}
            mode={'date'}
            display={'inline'}
          />
        ) : (
          <Picker selectedValue={new Date(dateTemp).getFullYear()} onValueChange={onValueChange}>
            {YearRange().map((item) => (
              <Picker.Item key={item.toString()} label={item.toString()} value={item} />
            ))}
          </Picker>
        )}
        <Pressable
          onPress={onDone}
          style={[styles.modalTitle, styles.bottom, { borderColor: colors.divider }]}
        >
          <Button title="Xong" onPress={onDone} />
        </Pressable>
      </ModalComponent>
    </>
  );
}
export default DateFilter;
