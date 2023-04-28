import { memo, useEffect, useState } from 'react';
import { getTransactionIdsByDate } from 'database/querying';
import isEqual from 'react-fast-compare';
import { FlatListComponent } from 'components/index';
import Record from './Record';

function ItemChild({ date, accountId }: { date: string; accountId: string }) {
  const [ids, setIds] = useState<string[]>();

  useEffect(() => {
    getTransactionIdsByDate({ accountId, date }).then((res) => {
      if (res) setIds(res);
    });
  }, [date]);

  const renderItem = ({ item }: { item: string }) => {
    return <Record id={item} />;
  };

  return <FlatListComponent id="" data={ids} renderItem={renderItem} />;
}

export default memo(ItemChild, isEqual);
