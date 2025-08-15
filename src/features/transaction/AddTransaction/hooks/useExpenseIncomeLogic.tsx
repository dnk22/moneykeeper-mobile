import { useEffect, useMemo } from 'react';
import { TTransactions, TTransactionsCategory } from 'database/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import { TransactionParamListProps } from 'navigation/types';
import HeaderIcon from 'navigation/components/HeaderIcon';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
import { deleteTransactionById, updateTransaction } from 'services/api/transactions';
import { useFormContext, useWatch } from 'react-hook-form';
import { showToast } from 'utils/system';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import { defaultValues, INPUT_AMOUNT_COLOR } from '../constant';
import { AddTransactionType } from '../type';
import { formatDataBeforeSubmit } from './utility';

export default function useExpenseIncomeHook({ params, onSubmitSuccess }: AddTransactionType) {
  const navigation =
    useNavigation<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation']>();
  const { name: routerName } =
    useRoute<TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['route']>();
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));
  const { handleSubmit, setValue, getValues, control, reset } = useFormContext<any>();

  const categoryId = useWatch({
    control,
    name: 'categoryId',
  });
  const recordAt = useWatch({
    control,
    name: 'recordAt',
  });
  const transactionType = useWatch({
    control,
    name: 'transactionType',
  });
  const relatedPerson = useWatch({
    control,
    name: 'relatedPerson',
  });
  const descriptions = useWatch({
    control,
    name: 'descriptions',
  });

  const inputAmountColor = INPUT_AMOUNT_COLOR[transactionType] || 'green';
  const isExpenseType = transactionType === TRANSACTION_TYPE.EXPENSE;

  const relatedPersonPlaceholder = [
    TRANSACTION_LEND_BORROW_NAME.BORROW,
    TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
  ].includes(lendBorrowData[categoryId])
    ? 'Người cho vay'
    : 'Người vay';

  const isLendBorrowType = useMemo(
    () => Boolean(lendBorrowData && Object.keys(lendBorrowData).includes(categoryId)),
    [categoryId],
  );

  const onFeeRemove = () => {
    setValue('fee', 0);
  };

  const handleOnDateTimePicker = (date: Date) => {
    setValue('recordAt', date);
  };

  const handleOnCategorySelect = (item?: TTransactionsCategory) => {
    const transactionType = getValues('transactionType');

    let screenTarget: any = ROUTES.EXPENSE_CATEGORY;
    if (
      item?.categoryName &&
      Object.values(TRANSACTION_LEND_BORROW_NAME).includes(item.categoryName)
    ) {
      screenTarget = ROUTES.LEND_BORROW;
    } else if (transactionType === TRANSACTION_TYPE.INCOME) {
      screenTarget = ROUTES.INCOME_CATEGORY;
    }

    navigation.navigate(ROUTES.TRANSACTION_CATEGORY, {
      screen: ROUTES.TRANSACTION_CATEGORY_TABS,
      params: {
        screen: screenTarget,
        params: {
          idActive: getValues('categoryId'),
          returnScreen: routerName,
        },
        initial: false,
      },
    });
  };

  const onDeleteTransaction = () => {
    if (params?.transactionId) {
      deleteTransactionById(params.transactionId)
        .then(() => navigation.goBack())
        .catch((err) =>
          showToast({
            type: 'error',
            text2: err.message || 'Vui lòng thử lại.',
          }),
        );
    }
  };

  const onSubmit = (data: TTransactions) => {
    const requestData = formatDataBeforeSubmit(data) as TTransactions;

    updateTransaction({
      data: requestData,
    })
      .then(() => {
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

  // Use `setOptions` to update the button that submit form
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderIcon onPress={handleSubmit(onSubmit)} />,
    });
  }, [navigation, handleSubmit, onSubmit]);

  useEffect(() => {
    const categoryName = lendBorrowData[categoryId];
    if (categoryName) {
      const currentDescription = descriptions?.split(':')[0].trim();
      // Check if the current description prefix is a lend/borrow name
      if (currentDescription === categoryName || (!currentDescription && relatedPerson)) {
        setValue('descriptions', `${categoryName} : ${relatedPerson || ''}`);
      }
    }
  }, [categoryId, relatedPerson, descriptions, lendBorrowData, setValue]);

  return {
    relatedPersonPlaceholder,
    categoryId,
    lendBorrowData,
    recordAt,
    isLendBorrowType,
    inputAmountColor,
    isExpenseType,
    handleOnCategorySelect,
    handleOnDateTimePicker,
    onFeeRemove,
    onDeleteTransaction,
    handleSubmit,
    onSubmit,
  };
}
