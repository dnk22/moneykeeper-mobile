import { useCallback, useContext, useMemo, useState } from 'react';
import { SectionListData } from 'react-native';
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
import AddButton from './AddButton';
import Header from '../Header';
import { queryAccounts } from 'database/querying';
import { accountListStyles as styles } from '../../styles';

function ActiveAccount() {
  const { colors } = useCustomTheme();
  const { onActionPress } = useContext(AccountContext);
  const { groupByType, sortByName } = useAppSelector((state) => selectAccountViewSettings(state));
  const [accountData, setAccountData] = useState<TAccount[]>([]);
  const sortField = useMemo(() => (sortByName ? 'accountName' : 'sortOrder'), [sortByName]);

  const fetchAccounts = useCallback(() => {
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, []),
  );

  const activeAccount = useMemo(() => {
    const activeAccount = accountData.filter((item) => item.isActive);
    return groupByType
      ? groupAccountDataByValue(activeAccount, sortField)
      : [{ data: activeAccount.sort(sortDataByKey(sortField)) }];
  }, [accountData, groupByType, sortField]);

  const renderSectionHeader = ({ section }: { section: SectionListData<TAccount> }) => {
    if (!groupByType) {
      return null;
    }
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
    <>
      <Header colors={colors} />
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
      <AddButton colors={colors.primary} />
    </>
  );
}

export default ActiveAccount;
