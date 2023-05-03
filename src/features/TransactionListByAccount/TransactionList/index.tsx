import { memo, useEffect, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import {
  getTransactionByAccountCountObserve,
  getTransactionLisGroupByDate,
} from 'database/querying';
import HeaderItem from './HeaderItem';
import withObservables from '@nozbe/with-observables';
import isEqual from 'react-fast-compare';

type TransactionListProps = {
  accountId: string;
  transactionCount?: number;
};
type DataProps = {
  date: string;
};
function TransactionList({ accountId, transactionCount }: TransactionListProps) {
  const [data, setData] = useState<DataProps[]>([]);

  useEffect(() => {
    fetchTransactionByGroupDate();
  }, [transactionCount]);

  const fetchTransactionByGroupDate = async () => {
    const res = await getTransactionLisGroupByDate({
      accountId,
    });
    if (res) {
      setData(res);
    }
  };

  const renderItem = ({ item }: { item: DataProps }) => {
    const { date } = item;
    return <HeaderItem item={date} accountId={accountId} />;
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default withObservables(['transactionCount'], ({ accountId }: TransactionListProps) => ({
  transactionCount: getTransactionByAccountCountObserve(accountId),
}))<any>(memo(TransactionList, isEqual));
