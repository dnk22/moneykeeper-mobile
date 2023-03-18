import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
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
import { getAccountById, getFirstAccount } from 'database/querying/accounts.query';

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
  const { dateTimeAt, accountId, transactionsTypeId } = getValues();

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

  useEffect(() => {
    if (accountId) {
      getAccountSelected();
    } else {
      setDefaultAccountInModeAdd();
    }
  }, [watch('accountId')]);

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
    navigation.navigate(ACCOUNT_PICKER, { accountSelectedId: accountId });
  };

  const setDefaultAccountInModeAdd = async () => {
    let accountId = '';
    if (params?.accountId) {
      const account = await getAccountById(params.accountId);
      if (account?.id) {
        accountId = account?.id;
      }
    } else {
      const firstAccount = await getFirstAccount();
      if (firstAccount && firstAccount.length) {
        accountId = firstAccount[0]?.id;
      }
    }
    if (accountId) {
      setValue('accountId', accountId);
    }
  };

  const getAccountSelected = async () => {
    const account = await getAccountById(accountId);
    if (account?.id) {
      const result = {
        accountName: account?.accountName,
        accountLogo: account.accountLogo,
      };
      useDispatch(setTransactionAccountSelected(result));
    }
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
                clearButtonMode="always"
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
            icon={accountSelected?.accountLogo}
            title="Chọn tài khoản"
            value={accountSelected?.accountName}
            onSelect={onSelectAccount}
            required
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default AddTransactions;
