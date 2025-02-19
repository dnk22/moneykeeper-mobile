import React, { useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import isArray from 'lodash/isArray';
import size from 'lodash/size';
import { queryGetTransactionsListByMonth } from 'database/querying';
import { groupTransactionsByDay } from 'utils/algorithm';
import { GroupedTransactionProps } from 'utils/types';
import HeaderItem from './HeaderItem';
import { TransactionHistoryContext } from '../context';
import VirtualizedListComponent from 'components/VirtualizedList';

function TransactionList() {
  const {
    accountId,
    refreshData,
    currentStatement: monthData,
  } = useContext(TransactionHistoryContext);
  const [data, setData] = useState<GroupedTransactionProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionByGroupDate();
    }, [accountId, monthData, refreshData]),
  );

  const fetchTransactionByGroupDate = () => {
    if (!size(monthData)) {
      return;
    }
    queryGetTransactionsListByMonth({
      accountId,
      startDate: monthData.startDate,
      endDate: monthData.endDate,
      getAll: monthData.month,
    }).then((res) => {
      if (isArray(res)) {
        setData(groupTransactionsByDay(res));
      }
    });
  };

  const renderItem = ({ item }: { item: GroupedTransactionProps }) => {
    return <HeaderItem transaction={item} />;
  };

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="date" />;
}

export default TransactionList;
