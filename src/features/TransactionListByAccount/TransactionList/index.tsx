import React, { useCallback, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import { getTransactionLisGroupByDate } from 'services/api/transactions';
import { useFocusEffect } from '@react-navigation/native';
import HeaderItem from './HeaderItem';
import { isArray } from 'lodash';

type TransactionListProps = {
  accountId: string;
};
type DataProps = {
  date: string;
};

function TransactionList({ accountId }: TransactionListProps) {
  const [data, setData] = useState<DataProps[]>([]);
  const [reload, setReload] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionByGroupDate();
    }, [accountId]),
  );

  const fetchTransactionByGroupDate = () => {
    getTransactionLisGroupByDate(accountId).then((res) => {
      if (isArray(res)) {
        setData(res);
        setReload(reload + 1);
      }
    });
  };

  const renderItem = ({ item }: { item: DataProps }) => {
    const { date } = item;
    return (
      <HeaderItem
        date={date}
        accountId={accountId}
        reload={reload}
        onRefreshDate={fetchTransactionByGroupDate}
      />
    );
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default TransactionList;
