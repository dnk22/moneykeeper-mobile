import { View } from 'react-native';
import { FlatListComponent, RNText, TouchableHighlightComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import withObservables from '@nozbe/with-observables';
import { TTransactionsCategory } from 'database/types';
import { getTransactionCategoryChildrenObserve } from 'database/querying';
import { ADD_TRANSACTION, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import styles from './styles';
import Child from './Child';
import Icon from './Icon';

type CategoryGroupItemProps = {
  expenseCategoryChildObserve?: any;
  item: TTransactionsCategory;
  id: string;
  type: TRANSACTION_CATEGORY_TYPE;
};

const CategoryChildItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(Child);

function CategoryGroupItem({ expenseCategoryChildObserve, item }: CategoryGroupItemProps) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state));

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    if (isUpdateMode) {
      navigation.navigate(UPDATE_TRANSACTION_CATEGORY, { transactionCategoryId: category.id });
      return;
    }
    navigation.navigate(ADD_TRANSACTION, { categoryId: category.id });
  };

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <CategoryChildItemObserve item={item} onPress={() => onItemCategoryPress(item)} />;
  };

  const isHaveChild = Boolean(expenseCategoryChildObserve.length);

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <TouchableHighlightComponent onPress={() => onItemCategoryPress(item)}>
        <View style={styles.itemHeader}>
          <Icon icon={item.icon} />
          <RNText numberOfLines={1} style={styles.headerTitle}>
            {item.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>
      {isHaveChild && <View style={styles.divider} />}
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
  ({ id, type }: CategoryGroupItemProps) => ({
    expenseCategoryChildObserve: getTransactionCategoryChildrenObserve(type, id),
  }),
)<any>(CategoryGroupItem);
