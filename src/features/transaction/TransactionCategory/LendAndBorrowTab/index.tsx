import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { TTransactionsCategory } from 'database/types';
import ParentItem from '../ExpenseIncomeTab/ParentItem';
import FlatListComponent from 'components/FlatList';
import { categoriesLocalQuery } from 'database/querying/categories';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TransactionCategoryParamProps } from 'navigation/types';
import { mapTitle } from '../constants.config';

function LendAndBorrowTab() {
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();
  const { name } = useRoute<TransactionCategoryParamProps['route']>();

  const [data, setData] = useState<TTransactionsCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Set the header title and right button based on the current tab
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          headerTitle: mapTitle[name],
          headerRight: () => <></>,
        });
      }
    }, []),
  );

  useEffect(() => {
    categoriesLocalQuery.getLendBorrowData().then((res) => setData(res));
  }, []);

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <ParentItem data={item} />;
  };

  return (
    <View style={{ padding: 6, flex: 1 }}>
      <FlatListComponent data={data} renderItem={renderItem} />
    </View>
  );
}

export default LendAndBorrowTab;
