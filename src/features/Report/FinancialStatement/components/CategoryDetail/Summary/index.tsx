import { useMemo } from 'react';
import { useAppSelector } from 'store/index';
import { getTotalAmount } from 'utils/algorithm';
import FlatListComponent from 'components/FlatList';
import Empty from 'components/Empty';
import AccountSummaryItem from './Item';
import { selectDataDetailLevel1 } from '../../../reducer/financialStatement.selector';
import { dataLevelProps } from '../types';

function AccountSummary() {
  const data = useAppSelector((state) => selectDataDetailLevel1(state));

  const totalCurrentAccount = useMemo(() => {
    return getTotalAmount(data);
  }, [data]);

  const renderItem = ({ item }: { item: dataLevelProps }) => {
    return <AccountSummaryItem item={item} totalAmount={totalCurrentAccount} />;
  };

  return (
    <FlatListComponent
      id="accountName"
      data={data}
      showSeparator
      renderItem={renderItem}
      ListEmptyComponent={<Empty />}
    />
  );
}
export default AccountSummary;
