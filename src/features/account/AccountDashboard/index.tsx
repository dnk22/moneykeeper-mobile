import React from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { ACCOUNT_TYPE_ALL, ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import AccountList from './components/AccountList';
import ItemSettingsModal from './components/ItemSettingsModal';
import { AccountContext } from './context';
import OverviewCard from './components/OverviewCard';
import AccountTypeTabs from './components/AccountTypeTabs';
import useAccountDashboard from './hooks/useAccountDashboard';
import { accountDashboardStyles as styles } from './styles';
import userHeaderOptions from './hooks/userHeaderOptions';
import { useCustomTheme } from 'resources/theme';

const ACCOUNT_TYPE_TABS = [ACCOUNT_TYPE_ALL, ...ACCOUNT_TYPE_LIST];

function AccountDashboard() {
  const { colors } = useCustomTheme();

  const {
    isShowModal,
    currentAccountPressed,
    pagerViewRef,
    pageIndex,
    accountData,
    fetchAccounts,
    openActionModal,
    closeActionModal,
    totalAsset,
    onTabChange,
    onPageSelected,
  } = useAccountDashboard();

  userHeaderOptions({ colors, pageIndex });

  return (
    <AccountContext.Provider
      value={{
        onActionPress: openActionModal,
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContainer}>
          <View style={[styles.overviewInitial]}>
            <OverviewCard totalAsset={totalAsset} colors={colors} />
          </View>
          <AccountTypeTabs pageIndex={pageIndex} onChangePageIndex={onTabChange} colors={colors} />
        </View>

        <View style={[styles.accountWrapper, { backgroundColor: colors.background }]}>
          <PagerView
            ref={pagerViewRef}
            style={styles.pagerContainer}
            initialPage={pageIndex}
            onPageSelected={(e) => onPageSelected(e.nativeEvent.position)}
          >
            {ACCOUNT_TYPE_TABS.map((accountType, index) => (
              <View key={accountType.id.toString()}>
                <AccountList
                  data={
                    accountType.id === ACCOUNT_TYPE_ALL.id
                      ? accountData
                      : accountData.filter((item) => item.accountTypeId === accountType.id)
                  }
                  index={index}
                  onRefresh={fetchAccounts}
                />
              </View>
            ))}
          </PagerView>
        </View>
      </View>
      <ItemSettingsModal
        isShowModal={isShowModal}
        onToggleModal={closeActionModal}
        currentAccount={currentAccountPressed.current}
        onRefresh={fetchAccounts}
      />
    </AccountContext.Provider>
  );
}

export default AccountDashboard;
