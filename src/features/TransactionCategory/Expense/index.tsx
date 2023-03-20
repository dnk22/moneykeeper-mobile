import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { FlatListComponent, InputSearch, RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { getTransactionCategoryParentObserve } from 'database/querying';
import CategoryGroupItem from '../CategoryGroupItem';
import withObservables from '@nozbe/with-observables';
import { TTransactionsCategory } from 'database/types';

const CategoryGroupItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(CategoryGroupItem);

function ExpenseCategory({ expenseCategoryObserve }: { expenseCategoryObserve: any }) {
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
        <View style={[styles.group, styles.mostRecent, { backgroundColor: colors.surface }]}>
          <RNText preset="subTitle">Dùng gần đây</RNText>
        </View>
        <FlatListComponent data={expenseCategoryObserve} renderItem={renderItem} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default withObservables(['expenseCategoryObserve'], () => ({
  expenseCategoryObserve: getTransactionCategoryParentObserve(TRANSACTION_CATEGORY_TYPE.EXPENSE),
}))<any>(ExpenseCategory);
