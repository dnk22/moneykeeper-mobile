import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useForm, useWatch } from 'react-hook-form';
import { TTransactions } from 'database/types';
import { getTransactionById } from 'services/api/transactions';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import { TRANSACTION_TYPE } from 'utils/constants';
import { defaultValues } from '../constant';
import { ROUTES } from 'navigation/constants/routes';
import { TransactionParamListProps } from 'navigation/types';
import { useHeaderOption } from './useHeaderOption';
import { useTransactionParamsSync } from './useTransactionParamsSync';
import { accountLocalQuery } from 'database/querying';

export function useAddTransactionFormLogic({
  navigation,
  route,
}: TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>) {
  const { params, name: routerName } = route;
  const lendBorrowData = useAppSelector(selectLendBorrowData);

  const transactionForm = useForm<TTransactions>({
    defaultValues: {
      ...defaultValues,
      amount: params?.amount || 0,
      transactionType: TRANSACTION_TYPE.EXPENSE,
    },
  });

  const { getValues, setValue, control, reset } = transactionForm;

  const accountId = useWatch({
    control,
    name: 'accountId',
  });

  const getDetailTransaction = async (id: string) => {
    const res = await getTransactionById(id);
    if (res?.id) {
      reset(res);
    }
  };

  const getDefaultAccountInAddMode = async () => {
    try {
      const firstAccount = await accountLocalQuery.getFirstActiveAccount();
      if (firstAccount) {
        setValue('accountId', firstAccount.id);
      }
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình lấy thông tin tài khoản');
    }
  };

  useHeaderOption({
    navigation,
    lendBorrowData,
    currentCategoryId: getValues('categoryId'),
    transactionType: getValues('transactionType'),
    isEditMode: !!params?.transactionId,
    setValue,
  });

  useTransactionParamsSync({
    params,
    navigation,
    getValues,
    setValue,
  });

  /** Set account mặc định khi mode add */
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !accountId && !params?.accountId) {
        getDefaultAccountInAddMode();
      }
    }, [params?.transactionId, accountId, params?.accountId]),
  );

  useEffect(() => {
    if (params?.transactionId) {
      getDetailTransaction(params.transactionId);
    }
  }, [params?.transactionId]);

  const onSubmitSuccess = () => {
    if (navigation.canGoBack() && routerName !== ROUTES.ADD_TRANSACTION) {
      navigation.goBack();
      return;
    }
    navigation.setParams({ categoryId: '' });
  };

  return {
    transactionForm,
    onSubmitSuccess,
    getValues,
  };
}
