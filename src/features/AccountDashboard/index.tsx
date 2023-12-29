import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { PressableHaptic, RNText, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ADD_ACCOUNT } from 'navigation/constants';
import { useAppSelector } from 'store/index';
import { TAccount } from 'database/types';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { getAccountData } from 'services/api/accounts';
import { formatNumber } from 'utils/math';
import ItemSettingsModal from './ItemSettingsModal';
import AccountList from './AccountList';
import styles from './styles';

function Accounts() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const { group } = useAppSelector((state) => selectAccountViewSettings(state));
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

  const handleOnCreateAccount = () => {
    navigation.navigate(ADD_ACCOUNT);
  };

  const onActionPress = useCallback((account: TAccount) => {
    currentAccountPressed.current = account;
    onToggleModal();
  }, []);

  const onActionPressDone = () => {
    fetchListAccount();
  };

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
        onActionPressDone={onActionPressDone}
      />
      <View style={styles.container}>
        <View style={styles.totalBalance}>
          <RNText style={styles.totalCurrency}>{`Tổng tiền: ${formatNumber(
            getTotalMoneyInAllAccount,
            true,
          )}`}</RNText>
        </View>
        <AccountList
          isGroup={group}
          account={accountData}
          onActionPress={onActionPress}
        />
        <PressableHaptic
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleOnCreateAccount}
        >
          <SvgIcon name="add" size={30} color="white" />
        </PressableHaptic>
      </View>
    </>
  );
}

export default Accounts;
