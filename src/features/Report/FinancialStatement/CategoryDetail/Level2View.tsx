import { useMemo } from 'react';
import { SectionListData, View } from 'react-native';
import { useAppSelector } from 'store/index';
import { RNText, SectionListComponent } from 'components/index';
import ItemSettingsModal from 'features/AccountDashboard/ItemSettingsModal';
import { selectDataDetailLevel2 } from '../reducer/financialStatement.selector';
import AccountItem from './AccountItem';
import { getTotalAmount } from 'utils/algorithm';
import { dataLevelProps } from '../types';

function Level2View() {
  const dataLevel2 = useAppSelector((state) => selectDataDetailLevel2(state)) || [];

  const dataFormatted = useMemo(() => {
    const groupedData: {
      [key: string]: {
        title: string;
        data: any[];
        amount: number;
      };
    } = {};

    dataLevel2.forEach((item: any) => {
      if (!groupedData[item.isActive]) {
        groupedData[item.isActive] = { title: '', data: [], amount: 0 };
      }
      groupedData[item.isActive].title = item.isActive;
      groupedData[item.isActive].amount = groupedData[item.isActive].amount +=
        item?.closingAmount || 0;
      groupedData[item.isActive].data.push(item);
    });
    return Object.values(groupedData).reverse();
  }, [dataLevel2]);

  const totalCurrentAccount = useMemo(() => {
    return getTotalAmount(dataLevel2);
  }, [dataLevel2]);

  const renderSectionHeader = ({ section }: { section: SectionListData<any> }) => {
    const { title } = section;
    if (title === undefined) return null;
    return (
      <RNText color="#747471" fontSize={13}>
        {title ? 'Đang sử dụng' : 'Ngưng sử dụng'}
      </RNText>
    );
  };

  const renderItem = ({ item, index }: { item: dataLevelProps; index: number }) => {
    return <AccountItem item={item} index={index} totalAmount={totalCurrentAccount} />;
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      {/* <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
        onActionPressDone={fetchListAccount}
      /> */}
      <SectionListComponent
        sections={dataFormatted}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
}
export default Level2View;
