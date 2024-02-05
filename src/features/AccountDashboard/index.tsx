import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { TAccount } from 'database/types';
import { getAccountData } from 'services/api/accounts';
import { formatNumber } from 'utils/math';
import ItemSettingsModal from './ItemSettingsModal';
import AccountList from './AccountList';
import styles from './styles';

function Accounts() {
  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [accountData, setAccountData] = useState<TAccount[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchListAccount();
    }, []),
  );

  const fetchListAccount = () => {
    getAccountData({}).then((res) => setAccountData(res));
  };

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const getTotalMoneyInAllAccount = useMemo(() => {
    return accountData.reduce(
      (accumulator, currentValue) => (accumulator += +currentValue?.closingAmount),
      0,
    );
  }, [accountData]);

  return (
    <>
      <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
        onActionPressDone={fetchListAccount}
      />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.totalCurrency}>{`Tổng tiền: ${formatNumber(
            getTotalMoneyInAllAccount,
            true,
          )}`}</RNText>
        </View>
        <AccountList
          account={accountData}
          onActionPress={onActionPress}
          onRefresh={fetchListAccount}
        />
      </View>
    </>
  );
}

export default Accounts;
