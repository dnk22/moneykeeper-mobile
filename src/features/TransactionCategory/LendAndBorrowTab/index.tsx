import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatListComponent } from 'components/index';
import { TTransactionsCategory } from 'database/types';
import { getLendBorrowCategory } from 'services/api/transactionsCategory';
import ParentItem from '../ExpenseIncomeTab/ParentItem';

function LendAndBorrowTab() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getLendBorrowCategory().then((res) => setData(res));
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
