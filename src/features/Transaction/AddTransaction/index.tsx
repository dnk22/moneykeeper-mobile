import { View } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import styles from './styles';
import { useForm } from 'react-hook-form';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import {
  ACCOUNT_PICKER,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
} from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { selectTransactionTypeSelected } from 'store/transactions/transactions.selector';
import { AddTransactionRouteProp } from 'navigation/types';
import {
  addNewTransaction,
  getAccountById,
  getFirstAccount,
  getTransactionCategoryById,
} from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { AccountModel } from 'database/models';

const initialAddFormValues: TTransactions = {
  amount: 0,
  transactionsTypeId: '1',
  dateTimeAt: new Date(),
  transactionsCategoryId: '',
  accountId: '',
};

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<AddTransactionRouteProp>();

  /** get redux state */
  const transactionTypeSelected = useAppSelector((state) => selectTransactionTypeSelected(state));

  /** local state */
  const [transactionCategorySelected, setTransactionCategorySelected] = useState<
    TransactionCategoryModel | undefined
  >();
  const [accountSelected, setTransactionAccountSelected] = useState<AccountModel | undefined>();
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

  /** watch transactionsTypeId from redux store and setValue to form */
  useLayoutEffect(() => {
    if (params?.hideHeader) {
      navigation.setOptions({
        headerShown: !params?.hideHeader,
      });
    }
  }, [params?.hideHeader]);

  /** set transactionsTypeId form value */
  useEffect(() => {
    setValue('transactionsTypeId', transactionTypeSelected);
  }, [transactionTypeSelected]);

  /** get transaction category selected data */
  useEffect(() => {
    if (params?.categoryId) {
      setCategorySelected(params.categoryId);
    }
  }, [params?.categoryId]);

  /** set accountId */
  useEffect(() => {
    if (params?.accountId) {
      setAccountSelected(params?.accountId);
    } else {
      setDefaultAccountInModeAdd();
    }
  }, [params?.accountId]);

  /** memoized function */
  const onToggleDateTimeModal = useCallback(
    (type?: 'date' | 'time') => {
      setIsDateTimeModalType(type);
    },
    [isDateTimeModalType],
  );

  const handleOnDateTimePicker = useCallback((date: Date) => {
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
  const setCategorySelected = async (id: string) => {
    setValue('transactionsCategoryId', id);
    const res = await getTransactionCategoryById(id);
    setTransactionCategorySelected(res);
  };

  const setAccountSelected = async (id: string) => {
    const account = await getAccountById(id);
    if (account?.id) {
      setValue('accountId', account.id);
      setTransactionAccountSelected(account);
    }
  };

  const setDefaultAccountInModeAdd = async () => {
    const firstAccount = await getFirstAccount();
    if (firstAccount && firstAccount.length) {
      setValue('accountId', firstAccount[0].id);
      setTransactionAccountSelected(firstAccount[0]);
    }
  };

  const handleOnSelectAccount = () => {
    navigation.navigate(ACCOUNT_PICKER, { accountSelectedId: getValues('accountId') });
  };

  const handleOnFeeChange = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      setValue('fee', 0);
    }
  };

  const handleOnSelectTransactionCategory = () => {
    let categoryType = TRANSACTION_CATEGORY_TYPE.EXPENSE;
    switch (getValues('transactionsTypeId')) {
      case '1':
        categoryType = TRANSACTION_CATEGORY_TYPE.INCOME;
        break;
      case '2':
      case '3':
        categoryType = TRANSACTION_CATEGORY_TYPE.LEND_BORROW;
        break;
      default:
        break;
    }
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: { tabActive: categoryType },
    });
  };

  const onSubmit = (data: TTransactions) => {
    console.log(data);
    addNewTransaction(data);
  };

  return (
    <View style={styles.container}>
      <DateTimeModalPicker
        value={getValues('dateTimeAt')}
        isVisible={isDateTimeModalType === 'date' || isDateTimeModalType === 'time'}
        mode={isDateTimeModalType}
        onToggleModal={onToggleDateTimeModal}
        onDateTimePicker={handleOnDateTimePicker}
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
            required
            icon={transactionCategorySelected?.icon}
            title="Chọn danh mục"
            value={transactionCategorySelected?.categoryName}
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
            onSelect={handleOnSelectAccount}
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
                <Switch value={isShowFee} onValueChange={handleOnFeeChange} />
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
        <Submit onPress={handleSubmit(onSubmit)} />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddTransactions;
