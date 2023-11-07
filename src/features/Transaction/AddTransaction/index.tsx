import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TRANSACTION_TYPE } from 'utils/constant';
import ExpenseAndIncome from './ExpenseAndIncome';
import { TransactionParamListProps } from 'navigation/types';
import { FormProvider, useForm } from 'react-hook-form';
import { TTransactions } from 'database/types';
import { getFirstAccount } from 'database/querying';
import { ADD_TRANSACTION } from 'navigation/constants';
import {
  getLendBorrowCategory,
  getTransactionCategoryByParams,
} from 'services/api/transactionsCategory';
import { getTransactionById } from 'services/api/transactions';
import { TTransactionType } from 'utils/types';
import { TransactionContext, defaultValues } from './constant';
import SelectTransactionType from './common/SelectTransactionType';
import Transfer from './Transfer';
import styles from './styles';

function AddTransactions() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const { params } = useRoute<TransactionParamListProps<typeof ADD_TRANSACTION>['route']>();
  const [lendBorrowData, setLendBorrowData] = useState<any>({});

  /** setup form */
  const transactionForm = useForm<TTransactions>({
    defaultValues: {
      ...defaultValues,
      transactionType: TRANSACTION_TYPE.EXPENSE,
    },
  });

  const { getValues, setValue, watch, reset } = transactionForm;

  useEffect(() => {
    getLendBorrowCategory().then((res: any[]) => {
      const data = res.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue.categoryName;
        return accumulator;
      }, {});
      setLendBorrowData(data);
    });
  }, []);

  // Use `setOptions` to update the transaction type select in header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          lendBorrowData={lendBorrowData}
          currentCategoryId={getValues('categoryId')}
          currentType={getValues('transactionType')}
          onItemPress={handleOnChangeTransactionType}
        />
      ),
    });
  }, [watch('categoryId'), watch('transactionType'), lendBorrowData]);

  // set default account when mode = add & accountId = null
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !watch('accountId')) {
        setDefaultAccountInModeAdd();
      }
    }, [params?.transactionId, watch('accountId')]),
  );

  useEffect(() => {
    if (params?.transactionId) {
      fetchDataInEditMode(params.transactionId);
    }
  }, [params?.transactionId]);

  /** get transaction category selected data */
  useEffect(() => {
    if (params?.categoryId && params?.categoryId !== getValues('categoryId')) {
      setValue('categoryId', params?.categoryId);
    }
  }, [params?.categoryId]);

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

  const handleOnChangeTransactionType = async (item: TTransactionType) => {
    setValue('transactionType', item.value);
    // handle Change TransactionCategory By Type
    let categoryId = '';
    if (item?.categoryType) {
      const newCategoryId = await getTransactionCategoryByParams({
        column: 'categoryName',
        value: item?.categoryType,
      });
      if (newCategoryId) {
        categoryId = newCategoryId.id;
      }
    }
    setValue('categoryId', categoryId);
  };

  const transactionTypeSelected = useCallback(
    (values: any[]) => {
      return values.includes(getValues('transactionType'));
    },
    [watch('transactionType')],
  );

  return (
    <TransactionContext.Provider
      value={{
        lendBorrowData,
      }}
    >
      <View style={styles.container}>
        <FormProvider {...transactionForm}>
          <KeyboardAwareScrollView
            style={[styles.form, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={40}
          >
            {transactionTypeSelected([TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME]) && (
              <ExpenseAndIncome params={params} />
            )}
            {transactionTypeSelected([TRANSACTION_TYPE.TRANSFER]) && <Transfer params={params} />}
          </KeyboardAwareScrollView>
        </FormProvider>
      </View>
    </TransactionContext.Provider>
  );
}

export default AddTransactions;
