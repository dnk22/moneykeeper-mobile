import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import InputSelection from 'components/InputSelection';
import { TRANSACTION_TYPE } from 'utils/constant';
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
import { CategoryProp } from '../../type';

type CategorySelectProps = {
  value?: string;
  control: any;
  error: any;
  currentScreen: string;
  categoryType: TRANSACTION_TYPE;
};

const mapTransactionTypeToTransactionCategory: any = {
  [TRANSACTION_TYPE.INCOME]: INCOME_CATEGORY,
  [TRANSACTION_TYPE.EXPENSE]: EXPENSE_CATEGORY,
  [TRANSACTION_TYPE.LEND]: LEND_BORROW,
  [TRANSACTION_TYPE.BORROW]: LEND_BORROW,
};

function CategorySelect({
  value,
  control,
  error,
  currentScreen,
  categoryType,
}: CategorySelectProps) {
  const navigation = useNavigation();
  const [categorySelected, setCategorySelected] = useState<CategoryProp | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [value]),
  );

  useEffect(() => {
    fetchCategoryData();
    return () => {
      resetTransactionCategory();
    };
  }, [value]);

  const fetchCategoryData = async () => {
    if (!value) return;
    try {
      const res = await getTransactionCategoryByID(value);
      if (!res) {
        resetTransactionCategory();
        return;
      }
      // if data no change , don't setState
      if (!isEqual(res, categorySelected)) {
        setCategorySelected(res);
      }
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
    }
  };

  const handleOnSelectTransactionCategory = () => {
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: mapTransactionTypeToTransactionCategory[categoryType],
        params: { idActive: value, returnScreen: currentScreen },
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
      error={error}
      icon={categorySelected?.icon}
      title="Chọn danh mục"
      value={categorySelected?.categoryName}
      onSelect={handleOnSelectTransactionCategory}
    />
  );
}
export default CategorySelect;
