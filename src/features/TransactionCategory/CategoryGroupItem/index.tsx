import { memo } from 'react';
import { View } from 'react-native';
import { FlatListComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import withObservables from '@nozbe/with-observables';
import { TTransactionsCategory } from 'database/types';
import { getTransactionCategoryChildrenObserve } from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import styles from './styles';
import Child from './Child';
import { ADD_TRANSACTION } from 'navigation/constants';

type CategoryGroupItemProps = {
  expenseCategoryChildObserve?: any;
  item: TTransactionsCategory;
  id: string;
};

const CategoryChildItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(Child);

function CategoryGroupItem({ expenseCategoryChildObserve, item }: CategoryGroupItemProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    navigation.navigate(ADD_TRANSACTION, { categoryId: category.id });
  };

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <CategoryChildItemObserve item={item} onPress={() => onItemCategoryPress(item)} />;
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <TouchableHighlightComponent onPress={() => onItemCategoryPress(item)}>
        <View style={[styles.itemHeader, { borderColor: colors.background }]}>
          <SvgIcon name={item.icon} size={28} />
          <RNText numberOfLines={1} style={styles.headerTitle}>
            {item.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>
      <FlatListComponent
        style={styles.childView}
        data={expenseCategoryChildObserve}
        renderItem={renderItem}
      />
    </View>
  );
}

export default withObservables(
  ['expenseCategoryChildObserve'],
  ({ id }: CategoryGroupItemProps) => ({
    expenseCategoryChildObserve: getTransactionCategoryChildrenObserve(
      TRANSACTION_CATEGORY_TYPE.EXPENSE,
      id,
    ),
  }),
)<any>(memo(CategoryGroupItem, isEqual));
