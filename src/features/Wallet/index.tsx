import React, { useCallback, useEffect, useState } from 'react';
import { Card, PressableHaptic, RNText, SvgIcon, SectionListComponent } from 'components/index';
import { View, SectionListData } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ADDWALLET } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { accountSelectors } from 'store/account/account.selector';
import { TAccount } from 'types/models';
import Item from './Item';
import ItemSettingsModal from './ItemSettingsModal';
import { accountViewSettingsSelector } from 'store/app/app.selector';

function Wallet() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const getAllAccountList = useAppSelector((state) => accountSelectors.selectAll(state));
  const accountViewSettings = useAppSelector((state) => accountViewSettingsSelector(state));

  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (accountViewSettings.group) {
      const dataGroup: any = groupDataByValue();
      setData(dataGroup);
    } else {
      setData([{ data: getAllAccountList }]);
    }
  }, [accountViewSettings.group, getAllAccountList.length]);

  const groupDataByValue = () => {
    const groupedData: any = {};
    getAllAccountList.forEach((item) => {
      if (!groupedData[item.account_type]) {
        groupedData[item.account_type] = { title: '', data: [] };
      }
      groupedData[item.account_type].title = item.account_type_name;
      groupedData[item.account_type].data.push(item);
    });
    return Object.values(groupedData);
  };

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const onActionPress = useCallback((account: TAccount) => {
    console.log(account, 'account');
    onToggleModal();
  }, []);

  const renderItem = ({ item }: { item: TAccount }) => {
    return <Item account={item} onActionPress={onActionPress} />;
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<any, any> }) => {
    return accountViewSettings.group ? <RNText>{section?.title}</RNText> : null;
  };

  const onCreateWallet = () => {
    navigation.navigate(ADDWALLET);
  };

  return (
    <>
      <ItemSettingsModal isVisible={isShowItemSettingsModal} onToggleModal={onToggleModal} />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.title}>Tổng tiền: 10000000Đ</RNText>
        </View>
        <Card>
          <SectionListComponent
            sections={data}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
          />
        </Card>
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
