import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { TAccount } from 'database/types';
import ActiveAccount from './components/ActiveAccount';
import InactiveAccount from './components/InactiveAccount';
import ItemSettingsModal from './components/ItemSettingsModal';
import { AccountContext } from './context';
import { useCustomTheme } from 'resources/theme';
import { accountDashboardStyles as styles } from './styles';

export enum ACCOUNT_STATUS {
  INACTIVE,
  ACTIVE,
}

function Accounts() {
  const { colors } = useCustomTheme();
  const accountPressed = useRef<TAccount | any>(null);
  const [isShowModal, setShowModal] = useState(false);
  const [isActiveAccount, setIsActiveAccount] = useState(ACCOUNT_STATUS.ACTIVE);

  const onToggleModal = () => {
    setShowModal(!isShowModal);
  };

  const onActionPress = (account: TAccount) => {
    accountPressed.current = account;
    onToggleModal();
  };

  return (
    <AccountContext.Provider
      value={{
        accountPressed: accountPressed.current,
        isShowModal,
        onToggleModal,
        onActionPress,
        ACCOUNT_STATUS,
        setIsActiveAccount,
        isActiveAccount,
      }}
    >
      <View style={[styles.container]}>
        <View style={[styles.accountWrapper, { backgroundColor: colors.surface }]}>
          <PagerView style={{ flex: 1 }} initialPage={0}>
            <View key={ACCOUNT_STATUS.ACTIVE}>
              <ActiveAccount />
            </View>
            <View key={ACCOUNT_STATUS.INACTIVE}>
              <InactiveAccount />
            </View>
          </PagerView>
        </View>
      </View>
      <ItemSettingsModal />
    </AccountContext.Provider>
  );
}

export default Accounts;
