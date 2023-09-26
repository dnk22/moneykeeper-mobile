import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { InputSearch, VirtualizedListComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { getTransactionCategoryParentObserve } from 'database/querying';
import { withObservables } from '@nozbe/watermelondb/react';
import { TTransactionsCategory } from 'database/types';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { toggleUpdateMode } from 'store/transactionCategory/transactionCategory.slice';
import { useAppDispatch } from 'store/index';
import CategoryGroupItem from '../CategoryGroupItem';
import MostAndRecent from './MostAndRecent';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

const CategoryGroupItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(CategoryGroupItem);

type CategoryTabProps = {
  expenseCategoryObserve?: Observable<TransactionCategoryModel[]>;
  type: TRANSACTION_CATEGORY_TYPE;
};
function CategoryTab({ expenseCategoryObserve, type }: CategoryTabProps) {
  const { colors } = useCustomTheme();
  const useDispatch = useAppDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      useDispatch(toggleUpdateMode(false));
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <CategoryGroupItemObserve item={item} id={item?.id} type={type} />;
  };

  const handleOnSearch = () => {};
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {type !== TRANSACTION_CATEGORY_TYPE.LEND_BORROW && (
          <>
            <InputSearch
              placeholder="Nhập tên"
              onChangeText={handleOnSearch}
              backgroundColor={colors.surface}
            />
            <MostAndRecent type={type} />
          </>
        )}
        <VirtualizedListComponent data={expenseCategoryObserve} renderItem={renderItem} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default withObservables([], ({ type }: CategoryTabProps) => ({
  expenseCategoryObserve: getTransactionCategoryParentObserve(type),
}))<any>(CategoryTab);
