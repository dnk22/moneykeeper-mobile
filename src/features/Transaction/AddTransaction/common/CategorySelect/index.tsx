import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import InputSelection from 'components/InputSelection';
import { BORROW, COLLECT_DEBTS, LEND, REPAYMENT, TRANSACTION_TYPE } from 'utils/constant';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
} from 'navigation/constants';
import { getTransactionCategoryByID } from 'services/api/transactionsCategory';
import { isEqual } from 'lodash';
import { TTransactionsCategory } from 'database/types';

type CategorySelectProps = {
  currentScreen: string;
};

const mapTransactionTypeToTransactionCategory: any = {
  [TRANSACTION_TYPE.INCOME]: INCOME_CATEGORY,
  [TRANSACTION_TYPE.EXPENSE]: EXPENSE_CATEGORY,
  [TRANSACTION_TYPE.LEND]: LEND_BORROW,
  [TRANSACTION_TYPE.BORROW]: LEND_BORROW,
};

function CategorySelect({ currentScreen }: CategorySelectProps) {
  const navigation = useNavigation();
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<any>();
  const [categorySelected, setCategorySelected] = useState<TTransactionsCategory | undefined>(
    undefined,
  );

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [watch('categoryId')]),
  );

  useEffect(() => {
    fetchCategoryData();
  }, [watch('categoryId')]);

  const fetchCategoryData = async () => {
    if (!getValues('categoryId')) return;
    try {
      const res = await getTransactionCategoryByID(getValues('categoryId'));
      if (!res) {
        resetTransactionCategory();
        return;
      }
      // if data no change , don't setState
      if (!isEqual(res.id, categorySelected?.id)) {
        setCategorySelected(res);
        // handleSetTransactionType(res);
      }
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
    }
  };

  const handleSetTransactionType = (item: TTransactionsCategory) => {
    let newTransactionType = watch('transactionType');
    switch (item.categoryName) {
      case LEND:
        newTransactionType = TRANSACTION_TYPE.LEND;
        break;
      case REPAYMENT:
        newTransactionType = TRANSACTION_TYPE.EXPENSE;
        break;
      case BORROW:
        newTransactionType = TRANSACTION_TYPE.BORROW;
        break;
      case COLLECT_DEBTS:
        newTransactionType = TRANSACTION_TYPE.BORROW;
        break;
      default:
        break;
    }
  };

  const handleOnSelectTransactionCategory = () => {
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: mapTransactionTypeToTransactionCategory[getValues('transactionType')],
        params: { idActive: getValues('categoryId'), returnScreen: currentScreen },
        initial: false,
      },
    });
  };

  const resetTransactionCategory = () => {
    setCategorySelected(undefined);
  };

  return (
    <InputSelection
      required
      name="categoryId"
      control={control}
      error={errors.categoryId}
      icon={categorySelected?.icon}
      title="Chọn danh mục"
      value={categorySelected?.categoryName}
      onSelect={handleOnSelectTransactionCategory}
    />
  );
}
export default CategorySelect;
