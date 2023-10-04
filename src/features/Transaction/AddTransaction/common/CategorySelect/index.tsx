import { useCallback, useEffect, useState } from 'react';
import InputSelection from 'components/InputSelection';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
} from 'navigation/constants';
import { getTransactionCategoryById } from 'database/querying';
import { isEqual } from 'lodash';
import { CategoryProp } from '../../type';
import { Alert } from 'react-native';

type CategorySelectProps = {
  value?: string;
  control: any;
  error: any;
  currentScreen: string;
};

const mapTransactionTypeToTransactionCategory: any = {
  [TRANSACTION_CATEGORY_TYPE.INCOME]: INCOME_CATEGORY,
  [TRANSACTION_CATEGORY_TYPE.EXPENSE]: EXPENSE_CATEGORY,
  [TRANSACTION_CATEGORY_TYPE.LEND_BORROW]: LEND_BORROW,
};

function CategorySelect({ value, control, error, currentScreen }: CategorySelectProps) {
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
      const res = await getTransactionCategoryById(value);
      if (!res) {
        resetTransactionCategory();
        return;
      }
      const newCategorySelected = {
        icon: res.icon,
        categoryType: res.categoryType,
        categoryName: res.categoryName,
        value: res.value,
      };
      // if data no change , don't setState
      if (!isEqual(newCategorySelected, categorySelected)) {
        setCategorySelected(newCategorySelected);
      }
      return true;
    } catch (error) {
      Alert.alert('Lỗi rồi!', 'Có lỗi trong quá trình lấy dữ liệu');
      return false;
    }
  };

  const handleOnSelectTransactionCategory = () => {
    navigation.navigate(TRANSACTION_CATEGORY, {
      screen: TRANSACTION_CATEGORY_LIST,
      params: {
        screen: mapTransactionTypeToTransactionCategory[categorySelected?.categoryType],
        returnScreen: currentScreen,
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
