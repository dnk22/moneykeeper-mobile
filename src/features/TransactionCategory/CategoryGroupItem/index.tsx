import { memo } from 'react';
import { FlatListComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TTransactionsCategory } from 'database/types';
import withObservables from '@nozbe/with-observables';
import { getTransactionCategoryChildrenObserve } from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import Child from './Child';

type CategoryGroupItemProps = {
  expenseCategoryChildObserve?: Observable<TransactionCategoryModel>;
  item: TTransactionsCategory;
  id: string;
};

const CategoryChildItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(Child);

function CategoryGroupItem({ expenseCategoryChildObserve, item }: CategoryGroupItemProps) {
  const { colors } = useCustomTheme();
  
  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <CategoryChildItemObserve item={item} />;
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <TouchableHighlightComponent>
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
