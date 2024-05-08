import React, { useCallback, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constant';
import ExpenseAndIncome from './ExpenseAndIncome';
import { TransactionParamListProps } from 'navigation/types';
import { FormProvider, useForm } from 'react-hook-form';
import { TTransactions } from 'database/types';
import { ADD_TRANSACTION } from 'navigation/constants';
import { getTransactionById } from 'services/api/transactions';
import { TTransactionType } from 'utils/types';
import { getFirstAccount } from 'services/api/accounts';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import { getKeyByValue } from 'utils/algorithm';
import { defaultValues } from './constant';
import SelectTransactionType from './common/SelectTransactionType';
import Transfer from './Transfer';
import Adjustment from './Adjustment';
import styles from './styles';

type AddTransactionsProps = {
  navigation: TransactionParamListProps<typeof ADD_TRANSACTION>['navigation'];
  route: TransactionParamListProps<typeof ADD_TRANSACTION>['route'];
};
function AddTransactions({ navigation, route }: AddTransactionsProps) {
  const { params, name: routerName } = route;
  const { colors } = useCustomTheme();
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));

  /** setup form */
  const transactionForm = useForm<TTransactions>({
    defaultValues: {
      ...defaultValues,
      amount: params?.amount || 0,
      transactionType: TRANSACTION_TYPE.EXPENSE,
    },
  });

  const { getValues, setValue, watch, reset } = transactionForm;

  // Use `setOptions` to update the transaction type select in header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          lendBorrowData={lendBorrowData}
          currentCategoryId={getValues('categoryId')}
          currentType={watch('transactionType')}
          onItemPress={handleOnChangeTransactionType}
          isEditMode={!!params?.transactionId}
        />
      ),
    });
    return () => {
      navigation.setOptions({
        headerTitle: () => undefined,
      });
    };
  }, [watch('categoryId'), watch('transactionType'), lendBorrowData]);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !watch('accountId') && !params?.accountId) {
        setDefaultAccountInModeAdd();
      }
    }, [params?.transactionId, watch('accountId'), params?.accountId]),
  );

  useEffect(() => {
    if (params?.transactionType) {
      setValue('transactionType', params.transactionType);
    }
  }, [params?.transactionType]);

  useEffect(() => {
    if (params?.transactionId) {
      fetchDataInEditMode(params.transactionId);
    }
  }, [params?.transactionId]);

  useEffect(() => {
    if (params?.accountId) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

  useEffect(() => {
    if (params?.categoryId && params?.categoryId !== getValues('categoryId')) {
      setValue('categoryId', params?.categoryId);
      navigation.setParams({
        categoryId: undefined,
      });
    }
  }, [params?.categoryId]);

  useEffect(() => {
    if (params?.relatedPerson) {
      setValue('relatedPerson', params?.relatedPerson);
      navigation.setParams({
        relatedPerson: undefined,
      });
    }
  }, [params?.relatedPerson]);

  const fetchDataInEditMode = async (id: string) => {
    const res = await getTransactionById(id);
    if (res?.id) {
      reset(res);
    }
  };

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

  const resetFormAfterChangeTransactionType = (item: TTransactionType) => {
    setValue('descriptions', '');
    setValue('toAccountId', '');
    setValue('toAmount', 0);
    setValue('toAccountId', '');
    if (
      ![TRANSACTION_LEND_BORROW_NAME.BORROW, TRANSACTION_LEND_BORROW_NAME.LEND].includes(item.name)
    ) {
      setValue('relatedPerson', '');
    } else {
      setValue('giver', '');
      setValue('payee', '');
    }
    if ([TRANSACTION_TYPE.TRANSFER, TRANSACTION_TYPE.ADJUSTMENT].includes(item.value)) {
      setValue('eventName', '');
    }
  };

  const handleOnChangeTransactionType = async (item: TTransactionType) => {
    resetFormAfterChangeTransactionType(item);
    // handle change category by type : LEND , BORROW
    setValue('categoryId', getKeyByValue(lendBorrowData, item?.categoryType));
    setValue('transactionType', item.value);
  };

  const transactionTypeSelected = (values: any[]) => {
    return values.includes(watch('transactionType'));
  };

  const onSubmitSuccess = () => {
    // navigate to previous screen
    if (navigation.canGoBack() && routerName !== ADD_TRANSACTION) {
      navigation.goBack();
      return;
    }
    navigation.setParams({
      categoryId: '',
    });
  };

  return (
    <View style={styles.container}>
      <FormProvider {...transactionForm}>
        <KeyboardAwareScrollView
          style={[styles.form, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={40}
        >
          {transactionTypeSelected([TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME]) && (
            <ExpenseAndIncome params={params} onSubmitSuccess={onSubmitSuccess} />
          )}
          {transactionTypeSelected([TRANSACTION_TYPE.TRANSFER]) && (
            <Transfer params={params} onSubmitSuccess={onSubmitSuccess} />
          )}
          {transactionTypeSelected([TRANSACTION_TYPE.ADJUSTMENT]) && (
            <Adjustment params={params} onSubmitSuccess={onSubmitSuccess} />
          )}
        </KeyboardAwareScrollView>
      </FormProvider>
    </View>
  );
}

export default AddTransactions;
