import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { TAccount } from 'database/types';
import AccountList from './components/AccountList';
import ItemSettingsModal from './components/ItemSettingsModal';
import { AccountContext } from './context';
import Header from './components/Header';
import AddButton from './components/AddButton';
import { useCustomTheme } from 'resources/theme';
import { queryAccounts } from 'database/querying';
import { showToast } from 'utils/system';
import { useFocusEffect } from '@react-navigation/native';
import { accountDashboardStyles as styles } from './styles';

function Accounts() {
  const { colors } = useCustomTheme();
  const currentAccountPressed = useRef<TAccount | any>(null);
  const [isShowModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [accountData, setAccountData] = useState<TAccount[]>([]);
  const pagerViewRef = useRef<PagerView>(null);

  const onActionPress = (account?: TAccount) => {
    currentAccountPressed.current = account;
    setShowModal(!isShowModal);
  };

  const onChangePageIndex = (index: number) => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(index);
    }
  };

  const fetchAccounts = () => {
    queryAccounts()
      .then((data) => {
        setAccountData(data);
      })
      .catch(() => {
        showToast({
          type: 'error',
          text2: 'Không thể tải danh sách tài khoản',
        });
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, []),
  );

  return (
    <AccountContext.Provider
      value={{
        onActionPress,
      }}
    >
      <View style={[styles.container]}>
        <View style={[styles.accountWrapper, { backgroundColor: colors.surface }]}>
          <Header colors={colors} isActive={!pageIndex} setPageIndex={onChangePageIndex} />
          <PagerView
            ref={pagerViewRef}
            style={styles.pagerContainer}
            initialPage={pageIndex}
            onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
            scrollEnabled={false}
          >
            <View key={0}>
              <AccountList data={accountData} onRefresh={fetchAccounts} />
            </View>
            <View key={1}>
              <AccountList data={accountData} isActive={false} onRefresh={fetchAccounts} />
            </View>
          </PagerView>
          {!pageIndex && <AddButton colors={colors.primary} />}
        </View>
      </View>
      <ItemSettingsModal
        isShowModal={isShowModal}
        onToggleModal={onActionPress}
        currentAccount={currentAccountPressed.current}
        onRefresh={fetchAccounts}
      />
    </AccountContext.Provider>
  );
}

export default Accounts;
