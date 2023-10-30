import React, { useContext } from 'react';
import { View } from 'react-native';
import { RNText, TouchableHighlightComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useNavigation } from '@react-navigation/native';
import { withObservables } from '@nozbe/watermelondb/react';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TransactionCategoryContext, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { getTransactionCategoryChildrenObserve } from 'services/api/transactionsCategory';
import Icon from '../common/Icon';
import GroupChild from '../common/GroupChild';
import styles from './styles';

type CategoryGroupItemProps = {
  expenseCategoryChildObserve?: any;
  item: TransactionCategoryModel;
  id: string;
  type?: TRANSACTION_CATEGORY_TYPE;
};

function CategoryGroupItem({ expenseCategoryChildObserve = [], item }: CategoryGroupItemProps) {
  const { colors } = useCustomTheme();
  const { isUpdate } = useContext<any>(TransactionCategoryContext);
  const navigation = useNavigation<any>();
  const isHaveChild = Boolean(expenseCategoryChildObserve.length);

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    if (isUpdate) {
      navigation.navigate(UPDATE_TRANSACTION_CATEGORY, { transactionCategoryId: category.id });
      return;
    }
    navigation.navigate({
      name: navigation.getParent()?.getState().routes[0].params?.params.returnScreen,
      params: { categoryId: category.id },
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
  ['expenseCategoryChildObserve', 'item', 'type'],
  ({ id, type, item }: CategoryGroupItemProps) => ({
    item: item.observe(),
    expenseCategoryChildObserve: getTransactionCategoryChildrenObserve(type, id),
  }),
)<any>(CategoryGroupItem);
