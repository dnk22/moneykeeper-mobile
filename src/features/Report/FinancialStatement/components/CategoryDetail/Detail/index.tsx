import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import FlatListComponent from 'components/FlatList';
import RNText from 'components/Text';
import { getTotalAmount } from 'utils/algorithm';
import ItemSettingsModal from 'features/account/AccountDashboard/components/ItemSettingsModal';
import { TAccount } from 'database/types';
import { useAppDispatch, useAppSelector } from 'store/index';
import Item from './Item';
import { setRefreshData } from '../../../reducer/financialStatement.slice';
import {
  selectDataSummary,
  selectDataDetail,
} from '../../../reducer/financialStatement.selector';
import { dataLevelProps } from '../types';

function Detail() {
  const dispatch = useAppDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const currentAccountPressed = useRef<TAccount | any>(null);
  const accountSummary = useAppSelector((state) => selectDataSummary(state)) || [];
  const isItemLevel2Selected = useAppSelector((state) => selectDataDetail(state)) || [];

  /** filter data for level2 with accountName selected */
  const dataFormatted = useMemo(() => {
    const accountDetail =
      accountSummary &&
      accountSummary.find((item) => item.accountName === isItemLevel2Selected)?.data;
    if (!accountDetail || !accountDetail.length) {
      return [];
    }
    return accountDetail;
  }, [accountSummary, isItemLevel2Selected]);

  const totalCurrentAccount = useMemo(() => {
    return getTotalAmount(dataFormatted);
  }, [dataFormatted]);

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onActionPress = (item: dataLevelProps) => {
    currentAccountPressed.current = item;
    onToggleModal();
  };

  const renderItem = ({ item, index }: { item: dataLevelProps; index: number }) => {
    return (
      <Item
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
      <RNText>{dataFormatted[0]?.title}</RNText>
      <FlatListComponent
        gap={0}
        data={dataFormatted}
        renderItem={renderItem}
        maintainVisibleContentPosition={{ disabled: true }}
      />
      <ItemSettingsModal
        isShowModal={isShowModal}
        onToggleModal={onToggleModal}
        currentAccount={currentAccountPressed.current}
        onRefresh={onActionDone}
      />
    </View>
  );
}
export default Detail;
