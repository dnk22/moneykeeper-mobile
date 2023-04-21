import { useCallback, useEffect, useState } from 'react';
import { VirtualizedListComponent } from 'components/index';
import { getGroupDateTransaction } from 'database/querying';
import Item from './Item';
import { AccountStackParamListProps } from 'navigation/types';
import { useRoute } from '@react-navigation/native';

type DataType = {
  dateTimeAt: string;
};

function TransactionList() {
  const { params } = useRoute<AccountStackParamListProps<'accountDetail'>['route']>();
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    fetchTransactionByGroupDate();
  }, []);

  const fetchTransactionByGroupDate = async () => {
    const res = await getGroupDateTransaction({ accountId: params.accountId });
    if (res) {
      setData(res);
    }
  };

  const renderItem = useCallback(({ item }: { item: DataType }) => {
    return <Item item={item} />;
  }, []);

  return <VirtualizedListComponent data={data} renderItem={renderItem} id="dateTimeAt" />;
}
export default TransactionList;
