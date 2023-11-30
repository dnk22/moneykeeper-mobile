import React, { useEffect, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import HeaderItem from './HeaderItem';
import { getTransactionLisGroupByDate } from 'services/api/transactions';

type TransactionListProps = {
  accountId: string;
};
type DataProps = {
  date: string;
};

function TransactionList({ accountId }: TransactionListProps) {
  const [data, setData] = useState<DataProps[]>([]);

  useEffect(() => {
    fetchTransactionByGroupDate();
  }, []);

  const fetchTransactionByGroupDate = () => {
    getTransactionLisGroupByDate(accountId).then((res) => {
      setData(res);
    });
  };

  const renderItem = ({ item }: { item: DataProps }) => {
    const { date } = item;
    return <HeaderItem date={date} accountId={accountId} />;
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default TransactionList;
