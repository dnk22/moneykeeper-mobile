import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { debounce, isEqual } from 'lodash';
import InputSelection from 'components/InputSelection';
import { getTransactionCategoryByID } from 'services/api/transactionsCategory';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_LEND_BORROW_NAME } from 'utils/constant';
import { TransactionContext } from '../../constant';

type CategorySelectProps = {
  onPress: (item?: TTransactionsCategory) => void;
};

function CategorySelect({ onPress }: CategorySelectProps) {
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
  const { setIsCurrentTransactionTypeIndex } = useContext(TransactionContext);

  const fetchCategoryData = debounce(() => {
    if (!getValues('categoryId')) {
      setCategorySelected(undefined);
      return;
    }
    try {
      getTransactionCategoryByID(getValues('categoryId')).then((res) => {
        // if data no change , don't setState
        if (!isEqual(res.id, categorySelected?.id)) {
          setCategorySelected(res);
          changeTypeByCategory(res);
        }
      });
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
    }
  }, 30);

  const changeTypeByCategory = (res: TTransactionsCategory) => {
    if (
      [TRANSACTION_LEND_BORROW_NAME.LEND, TRANSACTION_LEND_BORROW_NAME.BORROW].includes(
        res.categoryName,
      )
    ) {
      setIsCurrentTransactionTypeIndex(res.categoryType + 2);
    }
    if (res.categoryType !== getValues('transactionType')) {
      setIsCurrentTransactionTypeIndex(res.categoryType);
    }
    setValue('transactionType', res.categoryType);
  };

  const handleOnSelectTransactionCategory = () => {
    onPress && onPress(categorySelected);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [watch('categoryId'), categorySelected]),
  );

  useEffect(() => {
    fetchCategoryData();
  }, [watch('categoryId')]);

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
