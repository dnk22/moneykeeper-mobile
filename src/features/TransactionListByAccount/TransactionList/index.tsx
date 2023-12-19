import React, { useCallback, useEffect, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import { getTransactionLisGroupByDate } from 'services/api/transactions';
import { useFocusEffect } from '@react-navigation/native';
import HeaderItem from './HeaderItem';
import { TransactionContext } from './const';

type TransactionListProps = {
  accountId: string;
};
type DataProps = {
  date: string;
};

function TransactionList({ accountId }: TransactionListProps) {
  const [data, setData] = useState<DataProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionByGroupDate();
    }, []),
  );

  const fetchTransactionByGroupDate = () => {
    getTransactionLisGroupByDate(accountId).then((res) => {
      setData(res);
    });
  };

  const renderItem = ({ item }: { item: DataProps }) => {
    const { date } = item;
    return <HeaderItem date={date} accountId={accountId} />;
  };

  return (
    <TransactionContext.Provider value={{ onRefresh: fetchTransactionByGroupDate }}>
      <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />
    </TransactionContext.Provider>
  );
}

export default TransactionList;
