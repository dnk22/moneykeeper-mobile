import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import InputSelection from 'components/InputSelection';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constants';
import { showToast } from 'utils/system';
import { categoriesLocalQuery } from 'database/querying/categories';

type CategorySelectProps = {
  onPress: (item?: TTransactionsCategory) => void;
  onChange?: (item?: TTransactionsCategory) => void;
};

function CategorySelect({ onPress, onChange }: CategorySelectProps) {
  const [categorySelected, setCategorySelected] = useState<TTransactionsCategory | undefined>(
    undefined,
  );
  const { control, getValues, setValue } = useFormContext<any>();

  const categoryId = useWatch({
    control,
    name: 'categoryId',
  });

  const fetchCategoryData = debounce((id: string) => {
    if (!id) {
      setCategorySelected(undefined);
      return;
    }
    try {
      categoriesLocalQuery.getCategoryById(id).then((res) => {
        // if data no change , don't setState
        if (!isEqual(res, categorySelected)) {
          setCategorySelected(res);
          if (getValues('transactionType') !== TRANSACTION_TYPE.ADJUSTMENT) {
            setValue('transactionType', res.categoryType);
          }
        }
      });
    } catch (error) {
      showToast({
        type: 'info',
        text2: 'Chọn danh mục thất bại',
      });
    }
  }, 100);

  const handleOnSelectCategory = () => {
    onPress && onPress(categorySelected);
  };

  useEffect(() => {
    onChange && onChange(categorySelected);
  }, [categorySelected]);

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData(categoryId);
    }, [categoryId]),
  );

  return (
    <InputSelection
      required
      fieldName="categoryId"
      iconName={categorySelected?.icon}
      placeholder="Chọn danh mục"
      displayValue={categorySelected?.categoryName}
      onSelect={handleOnSelectCategory}
    />
  );
}
export default CategorySelect;
