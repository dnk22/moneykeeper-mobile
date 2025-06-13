import { useCallback, useContext, useMemo, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SectionListComponent from 'components/SectionList';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import { AccountContext } from 'features/AccountDashboard/context';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { showToast } from 'utils/system';
import { groupAccountDataByValue, sortDataByKey } from 'utils/algorithm';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import AccountItem from './Item';
import { accountListStyles as styles } from '../../styles';
import { queryAllAccount } from 'database/querying';

function ActiveAccount() {
  const { colors } = useCustomTheme();
  const { isActiveAccount, onActionPress } = useContext(AccountContext);
  const { group: isGroup, sort } = useAppSelector((state) => selectAccountViewSettings(state));
  const [accountData, setAccountData] = useState<TAccount[]>([]);

  const fetchAccounts = useCallback(() => {
    queryAllAccount()
      .then((data) => {
        setAccountData(data);
      })
      .catch(() => {
        showToast({
          type: 'error',
        });
      });
  }, [isActiveAccount]);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, []),
  );

  const activeAccount = useMemo(() => {
    const activeAccount = accountData.filter((item) => item.isActive);
    return isGroup
      ? groupAccountDataByValue(activeAccount, sort)
      : [{ data: activeAccount.sort(sortDataByKey(sort)) }];
  }, [accountData, isGroup, sort]);

  const renderSectionHeader = ({ section }: { section: SectionListData<TAccount> }) => {
    if (!isGroup) return null;
    const { title } = section;
    return (
      <RNText color={colors.textSecondary} fontSize={13}>
        {title}
      </RNText>
    );
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return <AccountItem account={item} onActionPress={onActionPress} />;
  };

  return (
    <SectionListComponent
      sections={activeAccount}
      initialNumToRender={8}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListEmptyComponent={
        <Empty
          styles={styles.emptyText}
          title="Bạn chưa có tài khoản nào"
          subTitle="Thêm tài khoản để bắt đầu theo dõi chi tiêu của bạn"
        />
      }
      onRefresh={fetchAccounts}
      hasPull
    />
  );
}

export default ActiveAccount;
