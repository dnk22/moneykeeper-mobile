import { useMemo, useRef, useState } from 'react';
import { SectionListData, View } from 'react-native';
import RNText from 'components/Text';
import SectionListComponent from 'components/SectionList';
import { getTotalAmount } from 'utils/algorithm';
import ItemSettingsModal from 'features/AccountDashboard/ItemSettingsModal';
import { TAccount } from 'database/types';
import { useAppDispatch, useAppSelector } from 'store/index';
import ItemLevel2 from './ItemLevel2';
import { dataLevelProps } from '../types';
import { setRefreshData } from '../reducer/financialStatement.slice';
import {
  selectDataDetailLevel1,
  selectDataDetailLevel2,
} from '../reducer/financialStatement.selector';

function Level2View() {
  const dispatch = useAppDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const currentAccountPressed = useRef<TAccount | any>(null);
  const dataLevel1 = useAppSelector((state) => selectDataDetailLevel1(state)) || [];
  const isItemLevel2Selected = useAppSelector((state) => selectDataDetailLevel2(state)) || [];

  const dataFormatted = useMemo(() => {
    const groupedData: {
      [key: string]: {
        title: string;
        data: any[];
        amount: number;
      };
    } = {};

    /** filter data for level2 with accountName selected */
    const dataLevel2 =
      dataLevel1 && dataLevel1.find((item) => item.accountName === isItemLevel2Selected)?.data;
    if (!dataLevel2 || !dataLevel2.length) {
      return {
        original: [],
        formatted: [],
      };
    }
    /** selection list data format */
    dataLevel2.forEach((item: any) => {
      if (!groupedData[item.isActive]) {
        groupedData[item.isActive] = { title: '', data: [], amount: 0 };
      }
      groupedData[item.isActive].title = item.isActive;
      groupedData[item.isActive].amount = groupedData[item.isActive].amount +=
        item?.closingAmount || 0;
      groupedData[item.isActive].data.push(item);
    });
    return {
      original: dataLevel2,
      formatted: Object.values(groupedData).reverse(),
    };
  }, [dataLevel1, isItemLevel2Selected]);

  const totalCurrentAccount = useMemo(() => {
    return getTotalAmount(dataFormatted.original);
  }, [dataFormatted.original]);

  const renderSectionHeader = ({ section }: { section: SectionListData<any> }) => {
    const { title } = section;
    if (title === undefined) return null;
    return (
      <RNText color="#747471" fontSize={13}>
        {title ? 'Đang sử dụng' : 'Ngưng sử dụng'}
      </RNText>
    );
  };

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onActionPress = (item: dataLevelProps) => {
    currentAccountPressed.current = item;
    onToggleModal();
  };

  const renderItem = ({ item, index }: { item: dataLevelProps; index: number }) => {
    return (
      <ItemLevel2
        item={item}
        index={index}
        totalAmount={totalCurrentAccount}
        onActionPress={onActionPress}
      />
    );
  };

  const onActionDone = () => {
    dispatch(setRefreshData());
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <ItemSettingsModal
        isVisible={isShowModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
        onActionPressDone={onActionDone}
      />
      <SectionListComponent
        sections={dataFormatted.formatted}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
}
export default Level2View;
