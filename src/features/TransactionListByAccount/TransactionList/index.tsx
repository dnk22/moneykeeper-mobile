import { memo, useEffect, useState } from 'react';
import { SectionListComponent } from 'components/index';
import { SectionListData } from 'react-native';
import {
  getTransactionByAccountCountObserve,
  getTransactionLisGroupByDate,
} from 'database/querying';
import HeaderItem from './HeaderItem';
import Record from './Record';
import withObservables from '@nozbe/with-observables';
import isEqual from 'react-fast-compare';
import ItemChild from './ItemChild';

type TransactionListProps = {
  accountId: string;
  transactionCount?: number;
};

type Data = {
  title: string;
  data: string[];
};
function TransactionList({ accountId, transactionCount }: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<Data[]>([]);

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
      setData([...data, ...res]);
      //   if (isLoadMore) {
      //     setData([...data, ...res]);
      //   } else {
      //     setSections(res);
      //   }
    }
  };

  const setSections = (newData: Data[]) => {
    const existingSectionTitles = data.map(({ title }) => title);
    const filteredNewSections = newData.filter(
      (newSection) => !existingSectionTitles.includes(newSection.title),
    );
    const mergedSections = data.map((section) => {
      const duplicateSection = newData.find((newSection) => newSection.title === section.title);
      if (duplicateSection) {
        return {
          ...section,
          data: [...new Set([...section.data, ...duplicateSection.data])],
        };
      }
      return section;
    });
    const updatedSections = [...mergedSections, ...filteredNewSections];
    setData(updatedSections);
  };

  const renderItem = ({ item }: { item: string }) => {
    return <ItemChild date={item} accountId={accountId} />;
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<string> }) => {
    const { title, data } = section;
    return <HeaderItem item={title} itemLength={data.length} />;
  };

  return (
    <SectionListComponent
      id=""
      sections={data}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
}

export default withObservables(['transactionCount'], ({ accountId }: TransactionListProps) => ({
  transactionCount: getTransactionByAccountCountObserve(accountId),
}))<any>(memo(TransactionList, isEqual));
