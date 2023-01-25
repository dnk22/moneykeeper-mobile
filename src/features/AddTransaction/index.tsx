import React, { ElementRef, useCallback, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { DynamicIsland } from 'resources/animations';
import TransactionTypePicker from './TransactionTypePicker';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { TTransactions, TTransactionType } from 'src/types/models';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import {
  DateTimeModalPicker,
  InputField,
  RNText,
  SvgIcon,
  Switch,
  SwitchField,
  PressableHaptic,
  InputCalculator,
  StatusBar,
} from 'components/index';
import { formatDateLocal } from 'utils/date';
import Animated, { StretchInY } from 'react-native-reanimated';

const initialAddFormValues: TTransactions = {
  _id: '',
  transactions_type: '1',
  date_time: new Date(),
  created_date: new Date(),
};

export default function AddTransactions() {
  const { colors } = useCustomTheme();
  const dynamicIsland = useRef<ElementRef<typeof DynamicIsland>>(null);
  const [isShowFee, setIsShowFee] = useState<boolean>(false);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [isDateTimeModalType, setIsDateTimeModalType] = useState<'date' | 'time' | undefined>(
    undefined,
  );
  const isShowDateTimeModal = isDateTimeModalType === 'date' || isDateTimeModalType === 'time';

  const { control, handleSubmit, getValues, setValue, watch } = useForm<TTransactions>({
    defaultValues: {
      ...initialAddFormValues,
    },
  });
  const { transactions_type_details, date_time } = getValues();

  const onHandleTransactionTypePress = useCallback((item: TTransactionType) => {
    setValue('transactions_type', item._id);
    setValue('transactions_type_details', item);
    dynamicIsland.current?.onToggle();
  }, []);

  const onToggleDateTimeModal = useCallback((type?: 'date' | 'time') => {
    setIsDateTimeModalType(type);
  }, []);

  const onDateTimePicker = useCallback((date: Date) => {
    setValue('date_time', date);
  }, []);

  const setInputTextColor = useMemo(() => {
    switch (watch('transactions_type')) {
      case '1':
      case '3':
        return 'red';
      case '2':
      case '4':
        return '#1fc600';
      default:
        return colors.primary;
    }
  }, [watch('transactions_type')]);

  const onToggleShowTransactionTypePicker = () => {
    dynamicIsland.current?.onToggle();
  };

  const onHandleFeeChange = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      setValue('fee', 0);
    }
  };

  const onHandleSubmit = (data: TTransactions) => {
    console.log(data);
  };

  return (
    <View style={[styles.container]}>
      <DynamicIsland ref={dynamicIsland}>
        <TransactionTypePicker
          onPressItem={onHandleTransactionTypePress}
          isTypeSelected={watch('transactions_type')}
        />
      </DynamicIsland>
      <DateTimeModalPicker
        value={date_time}
        isVisible={isShowDateTimeModal}
        mode={isDateTimeModalType}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={onDateTimePicker}
      />
      <StatusBar />
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <View style={styles.actionView} />
        <PressableHaptic
          style={[styles.actionView, styles.transactionTypePicker]}
          onPress={onToggleShowTransactionTypePicker}
        >
          <RNText color="white">{transactions_type_details?.name || 'Chi Tiền'}</RNText>
        </PressableHaptic>
        <PressableHaptic
          style={[styles.actionView, styles.rightAction]}
          onPress={handleSubmit(onHandleSubmit)}
        >
          <RNText color="white">Xong</RNText>
        </PressableHaptic>
      </View>
      <KeyboardAwareScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        <View style={[styles.group, styles.amount, { backgroundColor: colors.surface }]}>
          <RNText style={styles.amountLabel}>Số tiền</RNText>
          <InputCalculator inputTextColor={setInputTextColor} />
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="add" style={styles.icon} />
            <View style={styles.groupContent}>
              <RNText fontSize={20}>{watch('transactions_category') || 'Chọn danh mục'}</RNText>
              <SvgIcon name="forward" size={18} style={styles.iconForward} />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="textWord" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="descriptions"
                control={control}
                placeholder="Chi tiết"
                style={styles.formInput}
                clearButtonMode="always"
                maxLength={50}
              />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="calendarHoliday" style={styles.icon} />
            <View style={styles.groupContent}>
              <PressableHaptic onPress={() => onToggleDateTimeModal('date')}>
                <RNText>{formatDateLocal(watch('date_time'), 'EEEE, dd/MM/yyyy')}</RNText>
              </PressableHaptic>
              <PressableHaptic
                style={styles.iconForward}
                onPress={() => onToggleDateTimeModal('time')}
              >
                <RNText>{formatDateLocal(watch('date_time'), 'HH:mm')}</RNText>
              </PressableHaptic>
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="add" style={styles.icon} />
            <View style={styles.groupContent}>
              <RNText>{watch('transactions_category') || 'Chọn tài khoản'}</RNText>
              <SvgIcon name="forward" size={18} style={styles.iconForward} />
            </View>
          </View>
        </View>
        {isShowDetails && (
          <Animated.View entering={StretchInY}>
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={styles.itemGroup}>
                <SvgIcon name="people" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name="pay_for"
                    control={control}
                    placeholder="Chi cho ai"
                    style={styles.formInput}
                    clearButtonMode="always"
                    maxLength={50}
                  />
                </View>
              </View>
              <View style={styles.itemGroup}>
                <SvgIcon name="map" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name="location"
                    control={control}
                    placeholder="Địa điểm"
                    style={[styles.formInput, { width: '90%' }]}
                    clearButtonMode="always"
                    maxLength={50}
                  />
                  <SvgIcon name="location" size={18} style={styles.iconForward} />
                </View>
              </View>
              <View style={styles.itemGroup}>
                <SvgIcon name="camp" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name="event"
                    control={control}
                    placeholder="Chuyến đi / Sự kiện"
                    style={styles.formInput}
                    clearButtonMode="always"
                    maxLength={50}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <RNText>Phí</RNText>
                <Switch value={isShowFee} onValueChange={onHandleFeeChange} />
              </View>
              {isShowFee && (
                <Animated.View
                  style={[styles.group, styles.amount, { backgroundColor: colors.surface }]}
                  entering={StretchInY}
                >
                  <RNText style={styles.amountLabel}>Số tiền</RNText>
                  <InputCalculator inputTextColor={setInputTextColor} />
                </Animated.View>
              )}
            </View>
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <RNText>Không tính vào báo cáo</RNText>
                <SwitchField name="is_add_report" control={control} />
              </View>
              <RNText style={styles.subText}>
                Ghi chép này sẽ không thống kê vào các báo cáo.
              </RNText>
            </View>
          </Animated.View>
        )}
        <PressableHaptic
          style={[styles.group, styles.expandGroup, { backgroundColor: colors.surface }]}
          onPress={() => setIsShowDetails(!isShowDetails)}
        >
          <RNText>{isShowDetails ? 'Ẩn chi tiết' : 'Thêm chi tiết'}</RNText>
          <SvgIcon name={isShowDetails ? 'arrowUp' : 'arrowDown'} size={16} />
        </PressableHaptic>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.group, styles.submit, { backgroundColor: colors.primary }]}
          onPress={handleSubmit(onHandleSubmit)}
        >
          <SvgIcon name="doneCircle" color="white" />
          <RNText color="white" style={{ marginLeft: 5 }}>
            Lưu
          </RNText>
        </TouchableOpacity>
        <View style={styles.spacer}></View>
      </KeyboardAwareScrollView>
    </View>
  );
}
