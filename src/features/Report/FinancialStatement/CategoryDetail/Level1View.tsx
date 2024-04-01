import { useMemo } from 'react';
import { Empty, FlatListComponent } from 'components/index';
import { useAppSelector } from 'store/index';
import { getTotalAmount } from 'utils/algorithm';
import { selectDataDetailLevel1 } from '../reducer/financialStatement.selector';
import ItemLevel1 from './ItemLevel1';
import { dataLevelProps } from '../types';

function Level1View() {
  const data = useAppSelector((state) => selectDataDetailLevel1(state));

  const totalCurrentAccount = useMemo(() => {
    return getTotalAmount(data);
  }, [data]);

  const renderItem = ({ item }: { item: dataLevelProps }) => {
    return <ItemLevel1 item={item} totalAmount={totalCurrentAccount} />;
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
export default Level1View;
