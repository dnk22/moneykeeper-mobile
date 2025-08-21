import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TTransactions, TTransactionsCategory } from 'database/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderIcon from 'navigation/components/HeaderIcon';
import { deleteTransactionById, updateTransaction } from 'services/api/transactions';
import { showToast } from 'utils/system';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { TransactionParamListProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { balanceLocalQuery } from 'database/querying';
import { AddTransactionType } from '../type';

function useTransferLogic({ params, onSubmitSuccess }: AddTransactionType) {
  const prevCategoryType = useRef<TTransactionsCategory | undefined>(undefined);
  const navigation =
    useNavigation<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation']>();

  const { name: routerName } =
    useRoute<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['route']>();

  const [latestCurrentBalance, setLatestCurrentBalance] = useState(0);
  const { handleSubmit, setValue, getValues, reset, control } = useFormContext<any>();

  const isEditMode = useWatch({ name: 'id', control });
  const accountId = useWatch({ name: 'accountId', control });
  const amount = useWatch({ name: 'amount', control });
  const recordAt = useWatch({ name: 'recordAt', control });
  const closingAmount = useWatch({ name: 'closingAmount', control });

  const differenceBalance = useMemo(() => {
    return (closingAmount || 0) - latestCurrentBalance;
  }, [closingAmount, latestCurrentBalance]);

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderIcon onPress={handleSubmit(onSubmit)} />,
    });
    return () => {
      navigation.setOptions({
        headerRight: () => undefined,
      });
    };
  }, []);

  useEffect(() => {
    setValue('descriptions', 'Điều chỉnh số dư');
    return () => {
      setValue('descriptions', '');
    };
  }, []);

  /** get current balance and set default value to closing amount */
  useEffect(() => {
    if (params?.transactionId) {
      setLatestCurrentBalance(getValues('closingAmount') - amount);
      return;
    }
    balanceLocalQuery.getCurrentAccountBalance(accountId).then((res) => {
      if (res) {
        setLatestCurrentBalance(res.closingAmount);
        setValue('closingAmount', res.closingAmount);
      }
    });
  }, [accountId, amount]);

  /**
   * watch @differenceBalance
   * change @categoryId by @differenceBalance
   */
  useEffect(() => {
    if (!prevCategoryType.current) {
      return;
    }
    if (
      differenceBalance <= 0 &&
      prevCategoryType.current.categoryType === TRANSACTION_CATEGORY_TYPE.INCOME
    ) {
      setValue('categoryId', '');
    } else if (
      differenceBalance > 0 &&
      prevCategoryType.current.categoryType === TRANSACTION_CATEGORY_TYPE.EXPENSE
    ) {
      setValue('categoryId', '');
    } else {
      setValue('categoryId', prevCategoryType.current.id);
    }
  }, [differenceBalance]);

  const handleOnDateTimePicker = (date: Date) => {
    setValue('recordAt', date);
  };

  const handleOnCategoryPress = () => {
    navigation.navigate(ROUTES.TRANSACTION_CATEGORY, {
      screen: ROUTES.TRANSACTION_CATEGORY_TABS,
      params: {
        screen: differenceBalance <= 0 ? ROUTES.EXPENSE_CATEGORY : ROUTES.INCOME_CATEGORY,
        params: { idActive: getValues('categoryId'), returnScreen: routerName },
        tabsHide: differenceBalance <= 0 ? ROUTES.INCOME_CATEGORY : ROUTES.EXPENSE_CATEGORY,
      },
    });
  };

  const onCategoryChange = (item?: TTransactionsCategory) => {
    if (item) {
      prevCategoryType.current = item;
    }
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = {
      ...data,
      amount: differenceBalance,
      closingAmount: +data.closingAmount,
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
          categoryId: '',
        });
      })
      .catch(({ error }) => {
        showToast({
          type: 'error',
          text2: error,
        });
      });
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId).then(() => navigation.goBack());
    }
  };

  return {
    isEditMode,
    latestCurrentBalance,
    differenceBalance,
    formValues: {
      recordAt,
    },
    handleOnDateTimePicker,
    handleOnCategoryPress,
    onCategoryChange,
    onDeleteTransaction,
    onSubmit: handleSubmit(onSubmit),
  };
}
export default useTransferLogic;
