import { useEffect } from 'react';
import { TransactionParamListProps } from 'navigation/types';
import SelectTransactionType from '../components/SelectTransactionType';
import { TTransactionType } from 'utils/types/request.type';
import { transactionCategoryProps } from 'store/transactionCategory/transactionCategory.slice';
import { ROUTES } from 'navigation/constants/routes';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
import { getKeyByValue } from 'utils/algorithm';

interface Props {
  navigation: TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation'];
  lendBorrowData: transactionCategoryProps['lendBorrowData'];
  currentCategoryId: string;
  transactionType: TRANSACTION_TYPE;
  isEditMode: boolean;
  setValue: any;
}

export const useHeaderOption = ({
  navigation,
  lendBorrowData,
  currentCategoryId,
  transactionType,
  isEditMode,
  setValue,
}: Props) => {
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

  const handleOnChangeTransactionType = (item: TTransactionType) => {
    resetFormAfterChangeTransactionType(item);
    setValue('categoryId', getKeyByValue(lendBorrowData, item.categoryType));
    setValue('transactionType', item.value);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          lendBorrowData={lendBorrowData}
          currentCategoryId={currentCategoryId}
          currentType={transactionType}
          onItemPress={handleOnChangeTransactionType}
          isEditMode={isEditMode}
        />
      ),
    });

    return () => {
      navigation.setOptions({ headerTitle: undefined });
    };
  }, [lendBorrowData, currentCategoryId, transactionType]);
};
