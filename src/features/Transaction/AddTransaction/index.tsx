import React, { ElementRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { DynamicIsland } from 'resources/animations';
import TransactionTypePicker from './TransactionTypePicker';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { TAccount, TTransactions, TTransactionType } from 'src/types/models';
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
  InputSelection,
} from 'components/index';
import { formatDateLocal } from 'utils/date';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ACCOUNT_PICKER } from 'navigation/constants';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectFistAccounts } from 'store/account/account.selector';
import { selectAccountSelected } from 'store/transactions/transactions.selector';
import { setAccountSelected } from 'store/transactions/transactions.slice';

const initialAddFormValues: TTransactions = {
  _id: '',
  amount: 0,
  transactions_type_id: '1',
  date_time: new Date(),
};

export default function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute();
  const useDispatch = useAppDispatch();

  const getDefaultAccountData = useAppSelector((state) => selectFistAccounts(state));
  const getAccountSelected = useAppSelector((state) => selectAccountSelected(state));

  const dynamicIsland = useRef<ElementRef<typeof DynamicIsland>>(null);
  const [isShowFee, setIsShowFee] = useState<boolean>(false);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [isDateTimeModalType, setIsDateTimeModalType] = useState<'date' | 'time' | undefined>(
    undefined,
  );

  const { control, handleSubmit, getValues, setValue, watch } = useForm<TTransactions>({
    defaultValues: {
      ...initialAddFormValues,
    },
  });
  const { date_time, account_id } = getValues();

  useEffect(() => {
    if (!params?.transaction_id) {
      setValue('account_id', getDefaultAccountData._id);
      useDispatch(setAccountSelected(getDefaultAccountData));
    }
  }, [params?.transaction_id]);

  useEffect(() => {
    if (getAccountSelected) {
      setValue('account_id', getAccountSelected._id);
    }
  }, [getAccountSelected]);
  console.log(getAccountSelected, 'getAccountSelected');

  const onHandleTransactionTypePress = useCallback((item: TTransactionType) => {
    setValue('transactions_category_id', item._id);
    setValue('transactions_type_details', item);
    dynamicIsland.current?.onToggle();
  }, []);

  const onToggleDateTimeModal = useCallback((type?: 'date' | 'time') => {
    setIsDateTimeModalType(type);
  }, []);

  const onDateTimePicker = useCallback((date: Date) => {
    setValue('date_time', date);
  }, []);

  const getInputTextColor = useMemo(() => {
    switch (watch('transactions_type_id')) {
      case '1':
      case '3':
        return 'red';
      case '2':
      case '4':
        return '#1fc600';
      default:
        return colors.primary;
    }
  }, [watch('transactions_type_id')]);

  const onToggleShowTransactionTypePicker = () => {
    dynamicIsland.current?.onToggle();
  };

  const onHandleFeeChange = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      setValue('fee', 0);
    }
  };

  const onSelectTransactionType = () => {};

  const onSelectAccount = () => {
    navigation.navigate(ACCOUNT_PICKER, { account_id: account_id });
  };

  const onHandleSubmit = (data: TTransactions) => {
    console.log(data);
  };

  const isShowDateTimeModal = isDateTimeModalType === 'date' || isDateTimeModalType === 'time';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <DynamicIsland ref={dynamicIsland}>
        <TransactionTypePicker
          onPressItem={onHandleTransactionTypePress}
          isTypeSelected={watch('transactions_type_id')}
        />
      </DynamicIsland>
      <DateTimeModalPicker
        value={date_time}
        isVisible={isShowDateTimeModal}
        mode={isDateTimeModalType}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={onDateTimePicker}
      />
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <View style={styles.actionView} />
        <PressableHaptic
          style={[styles.actionView, styles.transactionTypePicker]}
          onPress={onToggleShowTransactionTypePicker}
        >
          <RNText color="white">{watch('transactions_type_details.name') || 'Chi Tiền'}</RNText>
        </PressableHaptic>
        <PressableHaptic
          style={[styles.actionView, styles.rightAction]}
          onPress={handleSubmit(onHandleSubmit)}
        >
          <RNText color="white">Xong</RNText>
        </PressableHaptic>
      </View>
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        <InputCalculator name="amount" control={control} inputTextColor={getInputTextColor} />
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <InputSelection
            icon={watch('transactions_type_details.icon')}
            title="Chọn danh mục"
            value={watch('transactions_category_details.category_name')}
            onSelect={onSelectTransactionType}
          />
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
          <InputSelection
            icon={
              getAccountSelected?.bank_details?.icon ||
              getAccountSelected?.provider_details?.icon ||
              getAccountSelected?.account_type_details?.icon
            }
            title="Chọn tài khoản"
            value={getAccountSelected?.name}
            onSelect={onSelectAccount}
          />
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
                <Animated.View entering={StretchInY}>
                  <InputCalculator name="fee" control={control} />
                </Animated.View>
              )}
            </View>
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemGroup, styles.itemGroupBetween]}>
                <RNText>Không tính vào báo cáo</RNText>
                <SwitchField name="is_not_add_report" control={control} />
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
          <RNText>{isShowDetails ? 'Ẩn chi tiết' : 'Hiển thị chi tiết'}</RNText>
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
    </SafeAreaView>
  );
}
