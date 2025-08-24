import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useForm, useWatch } from 'react-hook-form';
import { TTransactions } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import { TransactionParamListProps } from 'navigation/types';
import { accountLocalQuery, transactionLocalQuery } from 'database/querying';
import { deleteTransactionById } from 'services/api/transactions';
import { showToast } from 'utils/system';
import { useHeaderOption } from './useHeaderOption';
import { useTransactionParamsSync } from './useTransactionParamsSync';
import { formatDataDetail } from './utility';
import { defaultValues } from '../constant';

export function useAddTransactionFormLogic({
  navigation,
  route,
}: TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>) {
  const { params, name: routerName } = route;

  const transactionForm = useForm<TTransactions>({
    defaultValues: {
      ...defaultValues,
      amount: params?.amount || 0,
      transactionType: TRANSACTION_TYPE.EXPENSE,
    },
  });

  const { setValue, control, reset, getValues } = transactionForm;

  const accountId = useWatch({
    control,
    name: 'accountId',
  });

  const categoryId = useWatch({
    control,
    name: 'categoryId',
  });

  const transactionType = useWatch({
    control,
    name: 'transactionType',
  });

  useHeaderOption({
    navigation,
    currentCategoryId: categoryId,
    transactionType: transactionType,
    isEditMode: !!params?.transactionId,
    setValue,
  });

  useTransactionParamsSync({
    params,
    navigation,
    categoryId,
    setValue,
  });

  /** Set account mặc định khi mode add */
  useFocusEffect(
    useCallback(() => {
      if (!params?.transactionId && !accountId && !params?.accountId) {
        try {
          accountLocalQuery.getFirstActiveAccount().then((firstAccount) => {
            if (firstAccount) {
              setValue('accountId', firstAccount.id);
            }
          });
        } catch (error) {
          showToast({
            type: 'info',
            text2: 'Có lỗi trong quá trình lấy thông tin tài khoản',
          });
        }
      }
    }, [params?.transactionId, params?.accountId, accountId]),
  );

  useEffect(() => {
    if (params?.transactionId) {
      transactionLocalQuery.getTransactionById(params?.transactionId).then(transaction => {
        if (transaction) {
          reset(formatDataDetail(transaction));
        }
      });
    }
  }, [params?.transactionId]);

  // set lại ngày tháng ghi chép mỗi khi focus mới vào screen đi từ account
  useFocusEffect(
    useCallback(() => {
      if (
        (routerName as const) === ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT &&
        !params?.transactionId
      ) {
        setValue('recordAt', new Date().getTime());
      }
    }, [routerName, params?.transactionId]),
  );

  const onSubmitSuccess = useCallback(() => {
    if (navigation.canGoBack() && routerName !== ROUTES.ADD_TRANSACTION) {
      navigation.goBack();
      return;
    }
    navigation.setParams({ categoryId: '' });
    navigation.setParams({ toAccountId: '' });
    // reset form state
    reset({
      ...defaultValues,
      toAccountId: '',
      accountId: getValues('accountId'),
      transactionType: getValues('transactionType'),
    });
  }, [navigation, routerName]);

  const onDeleteTransaction = () => {
    const transactionId = getValues('id');
    if (transactionId) {
      deleteTransactionById(transactionId)
        .then(() => navigation.goBack())
        .catch((err) =>
          showToast({
            type: 'error',
            text2: err.message || 'Vui lòng thử lại.',
          }),
        );
    }
  };

  return {
    transactionForm,
    onSubmitSuccess,
    onDeleteTransaction,
  };
}
