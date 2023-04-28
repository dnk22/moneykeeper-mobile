import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
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
  FormAction,
} from 'components/index';
import { formatDateLocal } from 'utils/date';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  ACCOUNT_PICKER,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
} from 'navigation/constants';
import { AddTransactionRouteProp } from 'navigation/types';
import {
  addNewTransaction,
  getAccountById,
  getFirstAccount,
  getTransactionById,
  getTransactionCategoryById,
  updateTransactionById,
} from 'database/querying';
import Collapsible from 'react-native-collapsible';
import { ButtonText, SelectTransactionType } from 'navigation/elements';
import { isEqual } from 'lodash';
import { MAP_LEND_BORROW, TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';
import { EXPENSE_CATEGORY } from 'navigation/constants';
import { LEND_BORROW } from 'navigation/constants';
import { INCOME_CATEGORY } from 'navigation/constants';

const defaultValues = {
  amount: '0',
  dateTimeAt: new Date(),
  transactionsCategoryId: '',
  transactionsTypeId: TRANSACTION_TYPE.EXPENSE,
  accountId: '',
  descriptions: '',
  location: '',
  eventName: '',
  payFor: '',
  relatedPerson: '',
  fee: '',
  feeType: '',
  isNotAddReport: false,
  attachment: '',
  userId: '',
};

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params, name } = useRoute<AddTransactionRouteProp>();
  /** get redux state */

  /** local state */
  const [transactionCategorySelected, setTransactionCategorySelected] = useState<
    | { icon: string; categoryName: string; categoryType: TRANSACTION_CATEGORY_TYPE; value: string }
    | undefined
  >(undefined);
  const [accountSelected, setTransactionAccountSelected] = useState<
    { accountLogo: string; accountName: string } | undefined
  >(undefined);
  const [isShowFee, setIsShowFee] = useState<boolean>(false);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [isDateTimeModalType, setIsDateTimeModalType] = useState<'date' | 'time' | undefined>(
    undefined,
  );

  /** setup form */
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TTransactions>({
    defaultValues,
  });

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonText title="Xong" onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  // Use `setOptions` to update the transaction type select
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          isSelected={getValues('transactionsTypeId')}
          onItemPress={onItemTransactionTypePress}
        />
      ),
    });
  }, [watch('transactionsTypeId')]);

  useFocusEffect(
    useCallback(() => {
      updateFormDataWhenFocus();
    }, []),
  );

  useEffect(() => {
    if (params?.transactionId) {
      fetchDataInEditMode(params.transactionId);
    }
  }, [params?.transactionId]);

  /** get transaction category selected data */
  useEffect(() => {
    if (params?.categoryId) {
      setValue('transactionsCategoryId', params.categoryId);
    }
  }, [params?.categoryId]);

  /** reset transaction type by transaction category  */
  useEffect(() => {
    resetTransactionTypeByCategory();
  }, [transactionCategorySelected]);

  useEffect(() => {
    setCategorySelected();
  }, [watch('transactionsCategoryId')]);

  /** watch accountId */
  useEffect(() => {
    if (params?.accountId) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !getValues('accountId')) {
        setDefaultAccountInModeAdd();
      }
    }, [params?.transactionId, getValues('accountId')]),
  );

  useEffect(() => {
    setAccountSelected();
  }, [watch('accountId')]);

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
        case TRANSACTION_TYPE.EXPENSE:
        case TRANSACTION_TYPE.LEND:
          return 'red';
        case TRANSACTION_TYPE.INCOME:
        case TRANSACTION_TYPE.BORROW:
          return '#1fc600';
        default:
          return colors.primary;
      }
    }
  }, [watch('transactionsTypeId')]);

  /** pure function */
  const fetchDataInEditMode = async (id: string) => {
    const res = await getTransactionById(id);
    if (res?.id) {
      const result: any = {};
      Object.keys(defaultValues).forEach(
        (item) => (result[item] = res[item] || defaultValues[item]),
      );
      reset(result);
    }
  };

  const updateFormDataWhenFocus = async () => {
    await setCategorySelected();
    await setAccountSelected();
  };

  const onItemTransactionTypePress = (id: TRANSACTION_TYPE) => {
    if (id !== getValues('transactionsTypeId')) {
      resetTransactionCategory();
    }
    setValue('transactionsTypeId', id);
  };

  const setCategorySelected = async () => {
    if (!getValues('transactionsCategoryId')) return false;
    try {
      const res = await getTransactionCategoryById(getValues('transactionsCategoryId'));
      if (!res) {
        resetTransactionCategory();
        return false;
      }
      const transactionCategory = {
        icon: res.icon,
        categoryType: res.categoryType,
        categoryName: res.categoryName,
        value: res.value,
      };
      if (!isEqual(transactionCategory, transactionCategorySelected)) {
        setTransactionCategorySelected(transactionCategory);
      }
      return true;
    } catch (error) {
      console.log(error, 'setCategorySelected error');
      return false;
    }
  };

  const setAccountSelected = async () => {
    if (!watch('accountId')) return false;
    try {
      const account = await getAccountById(watch('accountId'));
      if (!account) {
        setValue('accountId', '');
        setTransactionAccountSelected(undefined);
        return false;
      }
      const newAccountState = {
        accountLogo: account.accountLogo,
        accountName: account.accountName,
      };
      if (!isEqual(newAccountState, accountSelected)) {
        setTransactionAccountSelected(newAccountState);
      }
      return true;
    } catch (error) {
      console.log(error, 'setAccountSelected error');
      return false;
    }
  };

  const setDefaultAccountInModeAdd = async () => {
    try {
      const firstAccount = await getFirstAccount();
      if (firstAccount && firstAccount.length) {
        setValue('accountId', firstAccount[0].id);
      }
    } catch (error) {
      console.log(error, 'setDefaultAccountInModeAdd error');
    }
  };

  const resetTransactionTypeByCategory = () => {
    if (!transactionCategorySelected) return;
    let transactionTypeId = getValues('transactionsTypeId');
    const categoryType: any = transactionCategorySelected?.categoryType;
    switch (categoryType) {
      case TRANSACTION_CATEGORY_TYPE.EXPENSE:
        transactionTypeId = TRANSACTION_TYPE.EXPENSE;
        break;
      case TRANSACTION_CATEGORY_TYPE.INCOME:
        transactionTypeId = TRANSACTION_TYPE.INCOME;
        break;
      case TRANSACTION_CATEGORY_TYPE.LEND_BORROW:
        transactionTypeId = MAP_LEND_BORROW[transactionCategorySelected.value];
        break;
      default:
        break;
    }
    setValue('transactionsTypeId', transactionTypeId);
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
    let categoryType: any = EXPENSE_CATEGORY;
    switch (getValues('transactionsTypeId')) {
      case TRANSACTION_TYPE.INCOME:
        categoryType = INCOME_CATEGORY;
        break;
      case TRANSACTION_TYPE.LEND:
      case TRANSACTION_TYPE.BORROW:
        categoryType = LEND_BORROW;
        break;
      default:
        break;
    }
    if (transactionCategorySelected?.value) {
      categoryType = LEND_BORROW;
    }
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: categoryType,
        returnScreen: name,
      },
    });
  };

  const handleOnShowDetail = () => {
    setIsShowDetails(!isShowDetails);
  };

  const resetTransactionCategory = () => {
    setValue('transactionsCategoryId', '');
    setTransactionCategorySelected(undefined);
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: +data?.amount,
      icon: transactionCategorySelected?.icon,
    };
    if (params?.transactionId) {
      updateTransactionById({ id: params.transactionId, data: requestData });
      // navigate to prev screen
      navigation.goBack();
    } else {
      addNewTransaction(requestData).then((res) => {
        if (res) {
          setTransactionCategorySelected(undefined);
          // reset form state
          reset(defaultValues);
        }
      });
    }
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
            name="transactionsCategoryId"
            control={control}
            error={errors.transactionsCategoryId}
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
            name="accountId"
            control={control}
            error={errors.accountId}
            onSelect={handleOnSelectAccount}
          />
        </View>
        <Collapsible collapsed={!isShowDetails}>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.itemGroup}>
              <SvgIcon name="people" style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="payFor"
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
                  placeholder="Sự kiện"
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
            <Collapsible collapsed={!isShowFee}>
              <Animated.View entering={StretchInY}>
                {/* <InputCalculator name="fee" control={control} /> */}
              </Animated.View>
            </Collapsible>
          </View>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={[styles.itemGroup, styles.itemGroupBetween]}>
              <RNText>Không tính vào báo cáo</RNText>
              <SwitchField name="isNotAddReport" control={control} />
            </View>
            <RNText style={styles.subText}>Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
          </View>
        </Collapsible>
        <PressableHaptic
          style={[styles.group, styles.expandGroup, { backgroundColor: colors.surface }]}
          onPress={handleOnShowDetail}
        >
          <RNText>{isShowDetails ? 'Ẩn chi tiết' : 'Hiển thị chi tiết'}</RNText>
          <SvgIcon name={isShowDetails ? 'arrowUp' : 'arrowDown'} size={16} />
        </PressableHaptic>
        <FormAction
          isShowDelete={Boolean(params?.transactionId)}
          onSubmit={handleSubmit(onSubmit)}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddTransactions;
