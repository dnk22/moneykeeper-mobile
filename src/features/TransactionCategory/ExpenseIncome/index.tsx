import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { FlatListComponent, InputSearch } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { getTransactionCategoryParentObserve } from 'database/querying';
import CategoryGroupItem from '../CategoryGroupItem';
import withObservables from '@nozbe/with-observables';
import { TTransactionsCategory } from 'database/types';
import Recent from './Recent';

const CategoryGroupItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(CategoryGroupItem);

type ExpenseCategoryProps = {
  expenseCategoryObserve?: any;
  type: TRANSACTION_CATEGORY_TYPE;
};
function ExpenseIncome({ expenseCategoryObserve }: ExpenseCategoryProps) {
  const { colors } = useCustomTheme();

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <CategoryGroupItemObserve item={item} id={item?.id} />;
  };

  const handleOnSearch = () => {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <InputSearch
          placeholder="Nhập tên"
          onChangeText={handleOnSearch}
          backgroundColor={colors.surface}
        />
        <Recent />
        <FlatListComponent data={expenseCategoryObserve} renderItem={renderItem} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default withObservables([], ({ type }: ExpenseCategoryProps) => ({
  expenseCategoryObserve: getTransactionCategoryParentObserve(type),
}))<any>(ExpenseIncome);
