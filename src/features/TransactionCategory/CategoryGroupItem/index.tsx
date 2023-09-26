import { View } from 'react-native';
import { RNText, TouchableHighlightComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import { withObservables } from '@nozbe/watermelondb/react';
import { TTransactionsCategory } from 'database/types';
import { getTransactionCategoryChildrenObserve } from 'database/querying';
import { TRANSACTION_CATEGORY_LIST, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { TransactionCategoryParamProps } from 'navigation/types';
import { mapCategoryTypeToTransactionType } from 'utils/helper';
import Icon from '../common/Icon';
import GroupChild from '../common/GroupChild';
import styles from './styles';

type CategoryGroupItemProps = {
  expenseCategoryChildObserve?: any;
  item: TTransactionsCategory;
  id: string;
  type: TRANSACTION_CATEGORY_TYPE;
};

function CategoryGroupItem({ expenseCategoryChildObserve, item }: CategoryGroupItemProps) {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof TRANSACTION_CATEGORY_LIST>['navigation']>();

  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state));
  const isHaveChild = Boolean(expenseCategoryChildObserve.length);

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    if (isUpdateMode) {
      navigation.navigate(UPDATE_TRANSACTION_CATEGORY, { transactionCategoryId: category.id });
      return;
    }
    const transactionTypeTarget = mapCategoryTypeToTransactionType({
      type: category.categoryType,
      value: category.value,
    });
    navigation.navigate({
      name: navigation.getParent()?.getState().routes[0].params?.returnScreen,
      params: { categoryId: category.id, transactionType: transactionTypeTarget },
      merge: true,
    });
  };

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
      <GroupChild data={expenseCategoryChildObserve} onItemCategoryPress={onItemCategoryPress} />
    </View>
  );
}

export default withObservables(
  ['expenseCategoryChildObserve'],
  ({ id, type }: CategoryGroupItemProps) => ({
    expenseCategoryChildObserve: getTransactionCategoryChildrenObserve(type, id),
  }),
)<any>(CategoryGroupItem);
