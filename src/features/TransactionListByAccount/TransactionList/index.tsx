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
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<DataProps[]>([]);

  useEffect(() => {
    if (currentPage) {
      fetchTransactionByGroupDate(true);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTransactionByGroupDate(false);
  }, [transactionCount]);

  const fetchTransactionByGroupDate = async (isLoadMore: boolean) => {
    const res = await getTransactionLisGroupByDate({
      accountId,
      page: currentPage,
      limit: 3,
    });
    if (res) {
      if (isLoadMore) {
        setData([...data, ...res]);
      } else {
        setSections(res);
      }
    }
  };

  const setSections = (newData: DataProps[]) => {
    const existingSectionTitles = data.map(({ date }) => date);
    const filteredNewSections = newData.filter(
      (newSection) => !existingSectionTitles.includes(newSection.date),
    );
    const mergedSections = data.map((section) => {
      const duplicateSection = newData.find((newSection) => newSection.date === section.date);
      if (duplicateSection) {
        return {
          ...section,
        };
      }
      return section;
    });
    const updatedSections = [...mergedSections, ...filteredNewSections];
    setData(updatedSections);
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
