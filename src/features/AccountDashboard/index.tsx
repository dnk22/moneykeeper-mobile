import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RNText from 'components/Text';
import { formatNumber } from 'utils/math';
import { TAccount } from 'database/types';
import { queryAllAccount } from 'database/querying';
import ItemSettingsModal from './ItemSettingsModal';
import AccountList from './AccountList';
import styles from './styles';
import { showToast } from 'utils/system';

function Accounts() {
  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowItemSettingsModal, setIsShowItemSettingsModal] = useState(false);
  const [accountData, setAccountData] = useState<TAccount[]>([]);

  const getAccounts = () => {
    queryAllAccount()
      .then((data) => {
        setAccountData(data);
      })
      .catch((err) => {
        showToast({
          type: 'error',
          text2: err,
        });
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAccounts();
    }, []),
  );

  const onToggleModal = () => {
    setIsShowItemSettingsModal(!isShowItemSettingsModal);
  };

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const getTotalMoneyInAllAccount = useMemo(() => {
    return accountData.reduce(
      (accumulator, currentValue) => (accumulator += +(currentValue?.closingAmount || 0)),
      0,
    );
  }, [accountData]);

  return (
    <>
      <ItemSettingsModal
        isVisible={isShowItemSettingsModal}
        onToggleModal={onToggleModal}
        account={currentAccountPressed.current}
        onActionPressDone={getAccounts}
      />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.totalCurrency}>{`Tổng: ${formatNumber(
            getTotalMoneyInAllAccount,
            true,
          )}`}</RNText>
        </View>
        <AccountList account={accountData} onActionPress={onActionPress} onRefresh={getAccounts} />
      </View>
    </>
  );
}

export default Accounts;
