import { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions, TTransactionsCategory } from 'database/types';
import {
  InputField,
  RNText,
  SvgIcon,
  SwitchField,
  InputCalculator,
  FormAction,
} from 'components/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ADD_TRANSACTION,
  CREATE_TRANSACTION_FROM_ACCOUNT,
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
} from 'navigation/constants';
import { TransactionParamListProps } from 'navigation/types';
import { deleteTransactionById } from 'database/querying';
import { ButtonText } from 'navigation/elements';
import { isEqual, isObject, size } from 'lodash';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constant';
import { updateTransaction } from 'services/api/transactions';
import { useFormContext } from 'react-hook-form';
import CategorySelect from '../common/CategorySelect';
import DateTimeSelect from '../common/DateTimeSelect';
import MoreDetail from '../common/MoreDetail';
import AccountSelect from '../common/AccountSelect';
import RelatedPersonSelect from '../common/RelatedPersonSelect';
import Fee from '../common/Fee';
import { AddTransactionType } from '../type';
import { TransactionContext } from '../constant';
import styles from '../styles.common';

function ExpenseAndIncome({ params }: AddTransactionType) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { name } = useRoute<TransactionParamListProps<typeof ADD_TRANSACTION>['route']>();
  const { lendBorrowData } = useContext(TransactionContext);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useFormContext<any>();

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <ButtonText title="Lưu" onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  /** start account function */
  const renderIfLendBorrow = () => {
    return Boolean(
      isObject(lendBorrowData) &&
        size(lendBorrowData) &&
        Object.keys(lendBorrowData).includes(getValues('categoryId')),
    );
  };

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  const getCategoryTabTarget = (currentCategory?: TTransactionsCategory) => {
    const { transactionType } = getValues();
    if (currentCategory) {
      if (Object.values(TRANSACTION_LEND_BORROW_NAME).includes(currentCategory.categoryName)) {
        return LEND_BORROW;
      }
    }
    if (transactionType === TRANSACTION_TYPE.EXPENSE) {
      return EXPENSE_CATEGORY;
    }
    if (transactionType === TRANSACTION_TYPE.INCOME) {
      return INCOME_CATEGORY;
    }
  };

  const handleOnCategoryPress = (item?: TTransactionsCategory) => {
    const screenTarget = getCategoryTabTarget(item);
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: screenTarget,
        params: { idActive: getValues('categoryId'), returnScreen: name },
        initial: false,
      },
    });
  };

  const handleOnClearFee = () => {
    setValue('fee', 0);
  };

  const resetAccount = () => {
    setValue('accountId', '');
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: +data.amount,
      fee: +data?.fee,
    };
    console.log(requestData, 'requestData');
    return;
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
        <CategorySelect onPress={handleOnCategoryPress} />
        {renderIfLendBorrow() && watch('categoryId') && (
          <RelatedPersonSelect
            control={control}
            title={
              [
                TRANSACTION_LEND_BORROW_NAME.BORROW,
                TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
              ].includes(lendBorrowData[watch('categoryId')])
                ? 'Người cho vay'
                : 'Người vay'
            }
          />
        )}
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
          setValue={setValue}
          onReset={resetAccount}
        />
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {!renderIfLendBorrow() && (
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
                    name="eventName"
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
        <Fee onClose={handleOnClearFee}>
          <InputCalculator name="fee" control={control} />
        </Fee>
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
