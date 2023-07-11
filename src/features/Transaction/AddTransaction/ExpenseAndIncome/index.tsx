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
  FormAction,
} from 'components/index';
import Animated, { StretchInY } from 'react-native-reanimated';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AddTransactionRouteProp } from 'navigation/types';
import { deleteTransactionById, getFirstAccount, getTransactionById } from 'database/querying';
import Collapsible from 'react-native-collapsible';
import { ButtonText } from 'navigation/elements';
import { isEqual } from 'lodash';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';
import { defaultValues } from './constant';
import DateTimeSelect from '../common/DateTimeSelect';
import MoreDetail from '../common/MoreDetail';
import styles from '../styles.common';
import { updateTransaction } from 'services/api/transactions';
import { TransactionTypeProps } from '../type';
import CategorySelect from '../common/CategorySelect';
import AccountSelect from '../common/AccountSelect';

function ExpenseAndIncome({ params }: TransactionTypeProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { name } = useRoute<AddTransactionRouteProp>();

  /** local state */
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
      transactionType: params.transactionType,
    },
  });

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonText title="Lưu" onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !getValues('accountId')) {
        setDefaultAccountInModeAdd();
      }
    }, [!params?.transactionId, watch('accountId')]),
  );

  useEffect(() => {
    setValue('transactionType', params?.transactionType);
  }, [params?.transactionType]);

  useEffect(() => {
    if (params?.transactionId) {
      fetchDataInEditMode(params.transactionId);
    }
  }, [params?.transactionId]);

  /** get transaction category selected data */
  useEffect(() => {
    setValue('categoryId', params?.categoryId);
    return () => {
      setValue('categoryId', '');
    };
  }, [params?.categoryId]);

  /** watch accountId */
  useEffect(() => {
    if (params?.accountId) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

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

  const resetAccount = () => {
    setValue('accountId', '');
  };
  /** start account function */

  const renderIfExpenseAndIncome = () => {
    return [TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME].includes(params.transactionType);
  };

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
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
    console.log(requestData);
    return ;
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
        <CategorySelect
          value={watch('categoryId')}
          control={control}
          error={errors.categoryId}
          currentScreen={name}
        />
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" style={styles.icon} />
          <View style={styles.groupContent}>
            <InputField
              name="descriptions"
              control={control}
              placeholder="Chi tiết"
              style={styles.formInput}
              maxLength={100}
            />
          </View>
        </View>
        <DateTimeSelect values={watch('dateTimeAt')} onChangeDate={handleOnDateTimePicker} />
        <AccountSelect
          value={watch('accountId')}
          control={control}
          error={errors.accountId}
          onReset={resetAccount}
        />
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {renderIfExpenseAndIncome() && (
            <>
              <View style={styles.itemGroup}>
                <SvgIcon name="people" style={styles.icon} />
                <View style={styles.groupContent}>
                  <InputField
                    name={watch('transactionType') === TRANSACTION_TYPE.EXPENSE ? 'giver' : 'payee'}
                    control={control}
                    placeholder={
                      watch('transactionType') === TRANSACTION_TYPE.EXPENSE
                        ? 'Chi cho ai'
                        : 'Nhận từ ai'
                    }
                    style={styles.formInput}
                    maxLength={50}
                  />
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
            </>
          )}
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
