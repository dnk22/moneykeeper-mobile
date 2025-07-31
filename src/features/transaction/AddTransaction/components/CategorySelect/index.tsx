import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import InputSelection from 'components/InputSelection';
import { getTransactionCategoryByID } from 'services/api/transactionsCategory';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constants';

type CategorySelectProps = {
  onPress: (item?: TTransactionsCategory) => void;
  onChange?: (item?: TTransactionsCategory) => void;
};

function CategorySelect({ onPress, onChange }: CategorySelectProps) {
  const [categorySelected, setCategorySelected] = useState<TTransactionsCategory | undefined>(
    undefined,
  );
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>();

  const categoryId = useWatch({
    control,
    name: 'categoryId',
  });

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

  const handleOnSelectCategory = () => {
    onPress && onPress(categorySelected);
  };

  useEffect(() => {
    onChange && onChange(categorySelected);
  }, [categorySelected]);

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [categoryId]),
  );

  return (
    <InputSelection
      required
      fieldName="categoryId"
      icon={categorySelected?.icon}
      placeholder="Chọn danh mục"
      displayValue={categorySelected?.categoryName}
      onSelect={handleOnSelectCategory}
    />
  );
}
export default CategorySelect;
