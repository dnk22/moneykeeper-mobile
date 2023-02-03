import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  PressableHaptic,
  RNText,
  SvgIcon,
  SectionListComponent,
  FlatListComponent,
} from 'components/index';
import { View, SectionListData } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ADDWALLET } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import {
  selectActiveAccounts,
  selectDeactivateActiveAccounts,
} from 'store/account/account.selector';
import { TAccount } from 'types/models';
import Item from './Item';
import ItemSettingsModal from './ItemSettingsModal';
import { selectAccountViewSettings } from 'store/app/app.selector';

function Wallet() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const getActiveAccounts = useAppSelector((state) => selectActiveAccounts(state));
  const getDeactivateActiveAccounts = useAppSelector((state) =>
    selectDeactivateActiveAccounts(state),
  );
  const { group } = useAppSelector((state) => selectAccountViewSettings(state));

  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [isActiveData, setIsActiveData] = useState<SectionListData<TAccount, any>>([]);
  const [isDeactivateData, setIsDeactivateData] = useState<TAccount[]>([]);

  useEffect(() => {
    if (!getActiveAccounts.length) return;
    if (group) {
      const dataGroup: any = groupDataByValue(getActiveAccounts);
      setIsActiveData(dataGroup);
    } else {
      setIsActiveData([{ data: getActiveAccounts }]);
    }
  }, [group, getActiveAccounts]);

  useEffect(() => {
    if (getDeactivateActiveAccounts.length) {
      setIsDeactivateData(getDeactivateActiveAccounts);
    }
  }, [getDeactivateActiveAccounts]);

  const groupDataByValue = useCallback((data: TAccount[]) => {
    if (!data.length) return [];
    const groupedData: any = {};
    data.forEach((item) => {
      if (!groupedData[item.account_type]) {
        groupedData[item.account_type] = { title: '', data: [] };
      }
      groupedData[item.account_type].title = item.account_type_details?.name;
      groupedData[item.account_type].data.push(item);
    });
    return Object.values(groupedData);
  }, []);

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const renderItem = ({ item }: { item: TAccount }) => {
    return <Item account={item} onActionPress={onActionPress} />;
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<TAccount> }) => {
    if (!group) return null;
    return <RNText style={styles.groupTitle}>{section?.title}</RNText>;
  };

  const onCreateWallet = () => {
    navigation.navigate(ADDWALLET);
  };

  return (
    <>
      <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
      />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.totalCurrency}>Tổng tiền: 10000000Đ</RNText>
        </View>
        {Boolean(getActiveAccounts.length) && (
          <Card title="Đang sử dụng">
            <SectionListComponent
              sections={isActiveData}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          </Card>
        )}
        {Boolean(getDeactivateActiveAccounts.length) && (
          <Card title="Ngưng sử dụng">
            <FlatListComponent data={isDeactivateData} renderItem={renderItem} />
          </Card>
        )}
        <PressableHaptic
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={onCreateWallet}
        >
          <SvgIcon name="add" size={30} color="white" />
        </PressableHaptic>
      </View>
    </>
  );
}

export default Wallet;
