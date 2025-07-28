import React from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import AccountList from './components/AccountList';
import ItemSettingsModal from './components/ItemSettingsModal';
import { AccountContext } from './context';
import Header from './components/Header';
import AddButton from './components/AddButton';
import useHook from './useHook';
import { accountDashboardStyles as styles } from './styles';

function Accounts() {
  const {
    isShowModal,
    fetchAccounts,
    currentAccountPressed,
    pagerViewRef,
    colors,
    pageIndex,
    accountData,
    onChangePageIndex,
    onActionPress,
    setPageIndex,
  } = useHook();

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
