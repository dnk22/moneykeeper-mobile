import { useEffect } from 'react';
import { TransactionParamListProps } from 'navigation/types';
import { TTransactionType } from 'utils/types/request.type';
import { ROUTES } from 'navigation/constants/routes';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
import { getKeyByValue } from 'utils/algorithm';
import { storageService } from 'services/storage';
import { MMKV_KEY } from 'services/storage/const';
import SelectTransactionType from '../components/SelectTransactionType';

interface Props {
  navigation: TransactionParamListProps<typeof ROUTES.ADD_TRANSACTION>['navigation'];
  currentCategoryId: string;
  transactionType: TRANSACTION_TYPE;
  isEditMode: boolean;
  setValue: any;
}

export const useHeaderOption = ({
  navigation,
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
  const lendBorrowData = JSON.parse(storageService.getItem(MMKV_KEY.LEND_BORROW_ID) || '{}');

  const handleOnTransactionTypeSelect = (item: TTransactionType) => {
    setValue('transactionType', item.value);
    setValue('categoryId', getKeyByValue(lendBorrowData, item.categoryType));
    resetFormAfterChangeTransactionType(item);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SelectTransactionType
          lendBorrowData={lendBorrowData}
          currentCategoryId={currentCategoryId}
          currentType={transactionType}
          onItemPress={handleOnTransactionTypeSelect}
          isEditMode={isEditMode}
        />
      ),
    });

    return () => {
      navigation.setOptions({ headerTitle: undefined });
    };
  }, [currentCategoryId, transactionType, lendBorrowData]);
};
