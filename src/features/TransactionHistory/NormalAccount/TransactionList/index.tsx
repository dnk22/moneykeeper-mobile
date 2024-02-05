import React, { useCallback, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { queryUniqueTransactionDates } from 'database/querying';
import { isArray } from 'lodash';
import HeaderItem from './HeaderItem';

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
      fetchTransactionLisGroupByDate();
    }, [accountId]),
  );

  const fetchTransactionLisGroupByDate = () => {
    queryUniqueTransactionDates(accountId).then((res) => {
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
        onRefreshDate={fetchTransactionLisGroupByDate}
      />
    );
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default TransactionList;
