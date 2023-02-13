import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, PressableHaptic, RNText, SvgIcon, FlatListComponent } from 'components/index';
import { View, SectionListData } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ADDACCOUNT } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import {
  selectActiveAccounts,
  selectDeactivateActiveAccounts,
} from 'store/account/account.selector';
import { TAccount } from 'types/models';
import ItemSettingsModal from './ItemSettingsModal';
import { selectAccountViewSettings } from 'store/app/app.selector';
import AccountList from './AccountList';
import { groupDataByValue } from 'utils/algorithm';

function Accounts() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const { group } = useAppSelector((state) => selectAccountViewSettings(state));
  const getActiveAccounts = useAppSelector((state) => selectActiveAccounts(state));
  const getDeactivateActiveAccounts = useAppSelector((state) =>
    selectDeactivateActiveAccounts(state),
  );

  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [isActiveData, setIsActiveData] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    if (group) {
      const dataGroup: any = groupDataByValue(getActiveAccounts);
      setIsActiveData(dataGroup);
    } else {
      setIsActiveData([{ data: getActiveAccounts }]);
    }
  }, [group, getActiveAccounts]);

  const getTotalAmount = useCallback((data: TAccount[]) => {
    const result = data.reduce((sum, account) => sum + account.current_amount, 0);
    return result;
  }, []);

  const renderTitle = useCallback(
    (title: string, value: TAccount[]) => {
      return `${title}${getTotalAmount(value)} ₫`;
    },
    [getTotalAmount],
  );

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const isHaveAccountsData = useMemo(
    () => !!isActiveData.length || !!getDeactivateActiveAccounts.length,
    [isActiveData, getDeactivateActiveAccounts],
  );

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const onCreateWallet = () => {
    navigation.navigate(ADDACCOUNT);
  };

  return (
    <>
      <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
      />
      <View style={styles.container}>
        {isHaveAccountsData && (
          <View style={styles.totalBalance}>
            <RNText style={styles.totalCurrency}>{renderTitle('Tổng tiền: ', isActiveData)}</RNText>
          </View>
        )}
        {!!isActiveData.length && (
          <Card title={renderTitle('Đang sử dụng: ', isActiveData)}>
            <AccountList data={isActiveData} isGroup={group} onActionPress={onActionPress} />
          </Card>
        )}
        {!!getDeactivateActiveAccounts.length && (
          <Card title="Ngưng sử dụng">
            <AccountList
              data={[{ data: getDeactivateActiveAccounts }]}
              isGroup={false}
              onActionPress={onActionPress}
            />
          </Card>
        )}
        {!isHaveAccountsData && (
          <View style={styles.noAccounts}>
            <RNText>Không có tài khoản nào!</RNText>
          </View>
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

export default Accounts;
