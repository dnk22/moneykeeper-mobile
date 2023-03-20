import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types/index';
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
  Submit,
} from 'components/index';
import { formatDateLocal } from 'utils/date';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ACCOUNT_PICKER, TRANSACTION_CATEGORY } from 'navigation/constants';
import { useAppDispatch, useAppSelector } from 'store/index';
import {
  selectTransactionTypeSelected,
  selectTransactionAccountSelected,
} from 'store/transactions/transactions.selector';
import { setTransactionAccountSelected } from 'store/transactions/transactions.slice';
import { AddTransactionRouteProp } from 'navigation/types';
import { getAccountById, getFirstAccount } from 'database/querying';

const initialAddFormValues: TTransactions = {
  id: '',
  amount: 0,
  transactionsTypeId: '1',
  dateTimeAt: new Date(),
};

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AddTransactionRouteProp>();
  const useDispatch = useAppDispatch();

  /** get redux state */
  const transactionTypeSelected = useAppSelector((state) => selectTransactionTypeSelected(state));
  const accountSelected = useAppSelector((state) => selectTransactionAccountSelected(state));

  /** local state */
  const [isShowFee, setIsShowFee] = useState<boolean>(false);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [isDateTimeModalType, setIsDateTimeModalType] = useState<'date' | 'time' | undefined>(
    undefined,
  );

  /** setup form */
  const { control, handleSubmit, getValues, setValue, watch } = useForm<TTransactions>({
    defaultValues: {
      ...initialAddFormValues,
    },
  });
  const { dateTimeAt } = getValues();

  /** watch transactionsTypeId from redux store and setValue to form */
  useLayoutEffect(() => {
    if (params?.hideHeader) {
      navigation.setOptions({
        headerShown: !params?.hideHeader,
      });
    }
  }, [params?.hideHeader]);

  useEffect(() => {
    setValue('transactionsTypeId', transactionTypeSelected);
  }, [transactionTypeSelected]);

  /** set accountId*/
  useEffect(() => {
    if (params?.transactionId) {
      getAccountSelected();
    } else {
      setDefaultAccountInModeAdd();
    }
  }, [params?.transactionId]);

  useEffect(() => {
    if (accountSelected?.id) {
      setValue('accountId', accountSelected.id);
    }
  }, [accountSelected?.id]);

  /** memoized function */
  const onToggleDateTimeModal = useCallback(
    (type?: 'date' | 'time') => {
      setIsDateTimeModalType(type);
    },
    [isDateTimeModalType],
  );

  const onDateTimePicker = useCallback((date: Date) => {
    setValue('dateTimeAt', date);
  }, []);

  /** memoized value */
  const memoizedInputTextColorValue = useMemo(() => {
    const { transactionsTypeId } = getValues();
    if (transactionsTypeId) {
      switch (transactionsTypeId) {
        case '1':
        case '3':
          return 'red';
        case '2':
        case '4':
          return '#1fc600';
        default:
          return colors.primary;
      }
    }
  }, [watch('transactionsTypeId')]);

  /** pure function */
  const onSelectAccount = () => {
    navigation.navigate(ACCOUNT_PICKER, { accountSelectedId: getValues('accountId') });
  };

  const getAccountSelected = async () => {
    const account = await getAccountById(getValues('accountId'));
    if (account?.id) {
      const result = {
        id: account?.id,
        accountName: account?.accountName,
        accountLogo: account.accountLogo,
      };
      useDispatch(setTransactionAccountSelected(result));
    }
  };

  const setDefaultAccountInModeAdd = async () => {
    let accountInfo: any = {};
    // if accountId param is exist - set it , else set with first account in database
    if (params?.accountId) {
      const account = await getAccountById(params.accountId);
      if (account?.id) {
        accountInfo.id = account?.id;
        accountInfo.accountName = account.accountName;
        accountInfo.accountLogo = account?.accountLogo;
      }
    } else {
      const firstAccount = await getFirstAccount();
      if (firstAccount && firstAccount.length) {
        accountInfo.id = firstAccount[0]?.id;
        accountInfo.accountName = firstAccount[0]?.accountName;
        accountInfo.accountLogo = firstAccount[0]?.accountLogo;
      }
    }
    useDispatch(setTransactionAccountSelected(accountInfo));
  };

  const onHandleFeeChange = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      setValue('fee', 0);
    }
  };

  const handleOnSelectTransactionCategory = () => {
    navigation.navigate(TRANSACTION_CATEGORY);
  };

  const onHandleSubmit = (data: TTransactions) => {
    console.log(data);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <DateTimeModalPicker
        value={dateTimeAt}
        isVisible={isDateTimeModalType === 'date' || isDateTimeModalType === 'time'}
        mode={isDateTimeModalType}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={onDateTimePicker}
      />
      <KeyboardAwareScrollView
        style={[styles.form, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={60}
      >
        <InputCalculator
          name="amount"
          control={control}
          inputTextColor={memoizedInputTextColorValue}
        />
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <InputSelection
            icon={'questionCircle'}
            title="Chọn danh mục"
            value={''}
            onSelect={handleOnSelectTransactionCategory}
          />
          <View style={styles.itemGroup}>
            <SvgIcon name="textWord" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="descriptions"
                control={control}
                placeholder="Chi tiết"
                style={styles.formInput}
                maxLength={50}
              />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="calendarHoliday" style={styles.icon} />
            <View style={styles.groupContent}>
              <PressableHaptic onPress={() => onToggleDateTimeModal('date')}>
                <RNText>{formatDateLocal(watch('dateTimeAt'), 'EEEE, dd/MM/yyyy')}</RNText>
              </PressableHaptic>
              <PressableHaptic
                style={styles.iconForward}
                onPress={() => onToggleDateTimeModal('time')}
              >
                <RNText>{formatDateLocal(watch('dateTimeAt'), 'HH:mm')}</RNText>
              </PressableHaptic>
            </View>
          </View>
          <InputSelection
            required
            icon={accountSelected?.accountLogo}
            value={accountSelected?.accountName}
            title="Chọn tài khoản"
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
        <Submit onPress={handleSubmit(onHandleSubmit)} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default AddTransactions;
