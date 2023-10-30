import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import { isEqual } from 'lodash';
import InputSelection from 'components/InputSelection';
import { getTransactionCategoryByID } from 'services/api/transactionsCategory';
import { TTransactionsCategory } from 'database/types';

type CategorySelectProps = {
  onPress: (item?: TTransactionsCategory) => void;
};

function CategorySelect({ onPress }: CategorySelectProps) {
  const {
    control,
    getValues,
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
    if (!getValues('categoryId')) {
      setCategorySelected(undefined);
      return;
    }
    try {
      const res = await getTransactionCategoryByID(getValues('categoryId'));
      // if data no change , don't setState
      if (!isEqual(res.id, categorySelected?.id)) {
        setCategorySelected(res);
      }
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
    }
  };

  const handleOnSelectTransactionCategory = () => {
    onPress && onPress(categorySelected);
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
