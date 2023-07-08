import { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import {
  InputField,
  RNText,
  SvgIcon,
  Switch,
  SwitchField,
  InputCalculator,
  InputSelection,
  FormAction,
} from 'components/index';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  ACCOUNT_PICKER,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  CREATE_TRANSACTION_FROM_ACCOUNT,
} from 'navigation/constants';
import { AddTransactionRouteProp } from 'navigation/types';
import {
  deleteTransactionById,
  getAccountById,
  getFirstAccount,
  getTransactionById,
  getTransactionCategoryById,
} from 'database/querying';
import Collapsible from 'react-native-collapsible';
import { ButtonText } from 'navigation/elements';
import { isEqual } from 'lodash';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';
import { defaultValues } from './data.default';
import DateTimeSelect from '../../common/DateTimeSelect';
import MoreDetail from '../../common/MoreDetail';
import styles from '../styles.common';
import { updateTransaction } from 'services/api/transactions';

type ExpenseAndIncome = {
  transactionType: TRANSACTION_TYPE;
  onChangeTransactionType: (value: TRANSACTION_TYPE) => void;
};

const mapTransactionType: any = {
  [TRANSACTION_TYPE.INCOME]: INCOME_CATEGORY,
  [TRANSACTION_TYPE.EXPENSE]: EXPENSE_CATEGORY,
};

function ExpenseAndIncome({ transactionType, onChangeTransactionType }: ExpenseAndIncome) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params, name } = useRoute<AddTransactionRouteProp>();

  /** local state */
  const [categorySelected, setCategorySelected] = useState<
    | { icon: string; categoryName: string; categoryType: TRANSACTION_CATEGORY_TYPE; value: string }
    | undefined
  >(undefined);
  const [accountSelected, setAccountSelected] = useState<
    { accountLogo: string; accountName: string } | undefined
  >(undefined);
  const [isShowFee, setIsShowFee] = useState<boolean>(false);

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
    defaultValues: {
      ...defaultValues,
      transactionType,
    },
  });

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonText title="Lưu" onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  useEffect(() => {
    onTransactionTypeChange();
  }, [transactionType]);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !getValues('accountId')) {
        setDefaultAccountInModeAdd();
      }
    }, [params?.transactionId, watch('accountId')]),
  );

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

  useEffect(() => {
    fetchAccountData();
  }, [watch('accountId')]);

  /** watch accountId */
  useEffect(() => {
    if (params?.accountId) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

  /** get transaction category selected data */
  useEffect(() => {
    if (params?.categoryId) {
      setValue('categoryId', params.categoryId);
    }
  }, [params?.categoryId]);

  /** watch categoryId and set category data*/
  useEffect(() => {
    fetchCategoryData();
  }, [watch('categoryId')]);

  const updateFormDataWhenFocus = async () => {
    await fetchCategoryData();
    await fetchAccountData();
  };

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

  /** watch transactionType, set to new state in form  */
  const onTransactionTypeChange = () => {
    if (transactionType !== getValues('transactionType')) {
      resetTransactionCategory();
    }
    setValue('transactionType', transactionType);
  };

  /** start category function */
  const handleOnSelectTransactionCategory = () => {
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: mapTransactionType[transactionType],
        returnScreen: name,
      },
    });
  };

  const fetchCategoryData = async () => {
    if (!getValues('categoryId')) return false;
    try {
      const res = await getTransactionCategoryById(getValues('categoryId'));
      if (!res) {
        resetTransactionCategory();
        return false;
      }
      const newCategorySelected = {
        icon: res.icon,
        categoryType: res.categoryType,
        categoryName: res.categoryName,
        value: res.value,
      };
      // if data no change , don't setState
      if (!isEqual(newCategorySelected, categorySelected)) {
        setCategorySelected(newCategorySelected);
      }
      // if new categoryType !=  current transactionType, change this
      if (!isEqual(res.categoryType, transactionType)) {
        resetTransactionTypeByCategory(res.categoryType);
      }
      return true;
    } catch (error) {
      console.log(error, 'setCategorySelected error');
      return false;
    }
  };

  const resetTransactionTypeByCategory = (newValue: TRANSACTION_TYPE) => {
    onChangeTransactionType(newValue);
  };

  const resetTransactionCategory = () => {
    setValue('categoryId', '');
    setCategorySelected(undefined);
  };
  /** end category function */

  /** start account function */
  const setDefaultAccountInModeAdd = async () => {
    try {
      const firstAccount = await getFirstAccount();
      if (firstAccount && firstAccount.length) {
        setValue('accountId', firstAccount[0].id);
      }
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình lấy thông tin tài khoản');
    }
  };

  const fetchAccountData = async () => {
    if (!watch('accountId')) return false;
    try {
      const account = await getAccountById(watch('accountId'));
      if (!account) {
        setValue('accountId', '');
        setAccountSelected(undefined);
        return false;
      }
      const newAccountState = {
        accountLogo: account.accountLogo,
        accountName: account.accountName,
      };
      // if data no change , don't setState
      if (!isEqual(newAccountState, accountSelected)) {
        setAccountSelected(newAccountState);
      }
      return true;
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình chọn tài khoản');
      return false;
    }
  };
  /** end account function */

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
  };

  const handleOnSelectAccount = () => {
    navigation.navigate(ACCOUNT_PICKER, { accountSelectedId: getValues('accountId') });
  };

  const handleOnShowFee = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      setValue('fee', 0);
    }
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: +data.amount,
      fee: +data?.fee,
    };
    updateTransaction({
      id: params?.transactionId,
      data: requestData,
    }).then((res) => {
      if (res) {
        // reset form state
        reset({
          ...defaultValues,
          accountId: data?.accountId,
          transactionType: data?.transactionType,
        });
        resetTransactionCategory();
      }
      if (navigation.canGoBack() && isEqual(name, CREATE_TRANSACTION_FROM_ACCOUNT)) {
        // navigate to prev screen
        navigation.goBack();
      }
    });
  };

  return (
    <View>
      <InputCalculator name="amount" control={control} />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <InputSelection
          required
          name="categoryId"
          control={control}
          error={errors.categoryId}
          icon={categorySelected?.icon}
          title="Chọn danh mục"
          value={categorySelected?.categoryName}
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
        <DateTimeSelect values={watch('dateTimeAt')} onChangeDate={handleOnDateTimePicker} />
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
      <MoreDetail>
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
            <Switch value={isShowFee} onValueChange={handleOnShowFee} />
          </View>
          <Collapsible collapsed={!isShowFee}>
            <Animated.View entering={StretchInY}>
              <InputCalculator name="fee" control={control} />
            </Animated.View>
          </Collapsible>
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="isNotAddReport" control={control} />
          </View>
          <RNText preset="subTitle">Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
      </MoreDetail>
      <FormAction
        isShowDelete={Boolean(params?.transactionId)}
        onDelete={onDeleteTransaction}
        onSubmit={handleSubmit(onSubmit)}
      />
      <View style={{ height: 150 }} />
    </View>
  );
}

export default ExpenseAndIncome;
