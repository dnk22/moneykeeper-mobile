import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactions, TTransactionsCategory } from 'database/types';
import { InputField, RNText, SvgIcon, SwitchField, FormAction } from 'components/index';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
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
import Submit from 'navigation/elements/Submit';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constant';
import { deleteTransactionById, updateTransaction } from 'services/api/transactions';
import { useFormContext } from 'react-hook-form';
import { showToast } from 'utils/system';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import CategorySelect from '../common/CategorySelect';
import DateTimeSelect from '../common/DateTimeSelect';
import MoreDetail from '../common/MoreDetail';
import AccountSelect from '../common/AccountSelect';
import RelatedPersonSelect from '../common/RelatedPersonSelect';
import Fee from '../common/Fee';
import InputCalculator from '../common/InputCalculator';
import { AddTransactionType } from '../type';
import { defaultValues } from '../constant';
import styles from '../styles.common';

function ExpenseAndIncome({ params, onSubmitSuccess }: AddTransactionType) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionParamListProps<typeof ADD_TRANSACTION>['navigation']>();
  const { name: routerName } =
    useRoute<TransactionParamListProps<typeof ADD_TRANSACTION>['route']>();
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));
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
      headerRight: () => <Submit onPress={handleSubmit(onSubmit)} />,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (routerName === CREATE_TRANSACTION_FROM_ACCOUNT && !params?.transactionId) {
        setValue('dateTimeAt', new Date());
      }
    }, [routerName, params?.transactionId]),
  );

  useEffect(() => {
    const noteText = getValues('descriptions') ? getValues('descriptions').split(':') : [''];
    if (
      (!getValues('descriptions') && getValues('relatedPerson')) ||
      Object.values(lendBorrowData).includes(noteText[0].trim())
    ) {
      setValue(
        'descriptions',
        `${lendBorrowData[getValues('categoryId')]} : ${getValues('relatedPerson')}`,
      );
    }
  }, [getValues('categoryId'), getValues('relatedPerson')]);

  /** start account function */
  const renderIfLendBorrow = () => {
    return Boolean(lendBorrowData && Object.keys(lendBorrowData).includes(getValues('categoryId')));
  };

  const handleOnDateTimePicker = (date: Date) => {
    setValue('dateTimeAt', date);
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId)
        .then(() => navigation.goBack())
        .catch((err) =>
          showToast({
            type: 'error',
            text2: err,
          }),
        );
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
        params: { idActive: getValues('categoryId'), returnScreen: routerName },
        initial: false,
      },
    });
  };

  const getInputCalculatorColor = () => {
    return getValues('transactionType') === TRANSACTION_TYPE.INCOME ? 'green' : 'red';
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      excludeReport: +data?.excludeReport,
      amount:
        data.transactionType === TRANSACTION_TYPE.INCOME
          ? Math.abs(+data.amount)
          : -Math.abs(+data.amount),
    };
    updateTransaction({
      id: params?.transactionId,
      data: requestData,
    })
      .then(({ success }) => {
        if (!success) {
          return;
        }
        onSubmitSuccess();
        // reset form state
        reset({
          ...defaultValues,
          accountId: data?.accountId,
          transactionType: data?.transactionType,
        });
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  return (
    <View>
      <InputCalculator name="amount" control={control} inputTextColor={getInputCalculatorColor()} />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <CategorySelect onPress={handleOnCategoryPress} />
        {renderIfLendBorrow() && watch('categoryId') && (
          <RelatedPersonSelect
            required
            fieldName="relatedPerson"
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
          <SvgIcon name="textWord" color={styles.iconShadow.color} />
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
        <AccountSelect />
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {!renderIfLendBorrow() && (
            <>
              <RelatedPersonSelect
                fieldName={
                  watch('transactionType') === TRANSACTION_TYPE.EXPENSE ? 'giver' : 'payee'
                }
                title={
                  watch('transactionType') === TRANSACTION_TYPE.EXPENSE
                    ? 'Chi cho ai'
                    : 'Nhận từ ai'
                }
              />
              <View style={styles.itemGroup}>
                <SvgIcon name="camp" color={styles.iconShadow.color} />
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
            <SvgIcon name="map" color={styles.iconShadow.color} />
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
        <Fee onClose={() => setValue('fee', 0)}>
          <InputCalculator name="fee" control={control} />
        </Fee>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" control={control} />
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
