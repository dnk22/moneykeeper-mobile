import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TTransactionsCategory } from 'database/types';
import { queryGetLendBorrowData } from 'database/querying';
import ParentItem from '../ExpenseIncomeTab/ParentItem';
import FlatListComponent from 'components/FlatList';

function LendAndBorrowTab() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    queryGetLendBorrowData().then((res) => setData(res));
  }, []);

  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return <ParentItem data={item} disabled />;
  };

  return (
    <View style={{ padding: 6, flex: 1 }}>
      <FlatListComponent data={data} renderItem={renderItem} />
    </View>
  );
}

export default LendAndBorrowTab;
