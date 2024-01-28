import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { debounce, isEqual } from 'lodash';
import InputSelection from 'components/InputSelection';
import { getTransactionCategoryByID } from 'services/api/transactionsCategory';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constant';

type CategorySelectProps = {
  onPress: (item?: TTransactionsCategory) => void;
  onChange?: (item?: TTransactionsCategory) => void;
};

function CategorySelect({ onPress, onChange }: CategorySelectProps) {
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>();
  const [categorySelected, setCategorySelected] = useState<TTransactionsCategory | undefined>(
    undefined,
  );

  const fetchCategoryData = debounce(() => {
    if (!getValues('categoryId')) {
      setCategorySelected(undefined);
      return;
    }
    try {
      getTransactionCategoryByID(watch('categoryId')).then((res) => {
        // if data no change , don't setState
        if (!isEqual(res, categorySelected)) {
          setCategorySelected(res);
          if (getValues('transactionType') !== TRANSACTION_TYPE.ADJUSTMENT) {
            setValue('transactionType', res.categoryType);
          }
        }
      });
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
    }
  }, 30);

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

  useEffect(() => {
    onChange && onChange(categorySelected);
  }, [categorySelected]);

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
