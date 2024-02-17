import React, { useCallback, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { queryUniqueTransactionDates } from 'database/querying';
import { isArray } from 'lodash';
import { useAppSelector } from 'store/index';
import { selectRefreshTransactionHistory } from 'store/transactions/transactions.selector';
import HeaderItem from './HeaderItem';

type TransactionListProps = {
  accountId: string;
};
type DataProps = {
  date: string;
};

function TransactionList({ accountId }: TransactionListProps) {
  const refreshTransactionHistory = useAppSelector((state) =>
    selectRefreshTransactionHistory(state),
  );
  const [data, setData] = useState<DataProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionLisGroupByDate();
    }, [accountId, refreshTransactionHistory]),
  );

  const fetchTransactionLisGroupByDate = () => {
    queryUniqueTransactionDates(accountId).then((res) => {
      if (isArray(res)) {
        setData(res);
      }
    });
  };

  const renderItem = ({ item }: { item: DataProps }) => {
    const { date } = item;
    return (
      <HeaderItem
        date={date}
        accountId={accountId}
        reload={refreshTransactionHistory}
        onRefreshDate={fetchTransactionLisGroupByDate}
      />
    );
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default TransactionList;
