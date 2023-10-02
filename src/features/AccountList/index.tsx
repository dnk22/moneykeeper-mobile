import { memo, useCallback, useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { Card, Empty, InputSearch, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import Item from './Item';
import { withObservables } from '@nozbe/watermelondb/react';
import { getAccounts, getActiveAccountObserve } from 'database/querying';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupDataByValue } from 'utils/algorithm';
import { SCREEN_HEIGHT } from 'share/dimensions';
import isEqual from 'react-fast-compare';
import styles from './styles';

type AccountListProps = {
  title: string;
  isDeactivate?: boolean;
  isGroup?: boolean;
  isItemSelected?: string;
  isShowSearch?: boolean;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
  accountsObservables?: Observable<AccountModel[]>;
};

const maxHeight = SCREEN_HEIGHT * 0.5;

const AccountItemObserve = memo(
  withObservables(['account'], ({ account }) => ({
    account: account.observe(),
  }))(Item),
  isEqual,
);

function AccountList({
  title,
  isDeactivate,
  isGroup = false,
  isShowSearch = false,
  isItemSelected,
  onActionPress,
  onItemPress,
  accountsObservables,
}: AccountListProps) {
  const [collapse, setCollapse] = useState(false);
  const [accounts, setAccounts] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    if (!isDeactivate) {
      setActiveAccounts(accountsObservables);
    }
  }, [isGroup, accountsObservables]);

  useEffect(() => {
    setCollapse(!Boolean(accounts.length));
  }, [accounts]);

  useEffect(() => {
    if (isDeactivate) {
      const result = accountsObservables?.length ? [{ data: accountsObservables }] : [];
      setAccounts(result);
    }
  }, [accountsObservables]);

  const setActiveAccounts = async (data: any) => {
    const dataGroup: any[] = groupAccount(data);
    setAccounts(dataGroup);
  };

  const groupAccount = useCallback((account: any) => groupDataByValue(account), []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<TAccount> }) => {
      if (!isGroup) return null;
      const { title } = section;
      return (
        <View style={styles.groupTitle}>
          <RNText color="#747471">{`${title}`}</RNText>
        </View>
      );
    },
    [isGroup],
  );

  const renderItem = useCallback(({ item }: { item: TAccount }) => {
    return (
      <AccountItemObserve
        account={item}
        onActionPress={onActionPress}
        onItemPress={onItemPress}
        isItemSelected={isItemSelected}
      />
    );
  }, []);

  const onInputChange = async (text: string) => {
    const res = await getAccounts({ text });
    setActiveAccounts(res);
  };

  return (
    <Card title={title} collapse={collapse}>
      {isShowSearch && <InputSearch onChangeText={onInputChange} />}
      <SectionListComponent
        style={{ maxHeight }}
        sections={accounts}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
      />
    </Card>
  );
}

export default withObservables(
  ['accountsObservables'],
  ({ isDeactivate = false }: AccountListProps) => ({
    accountsObservables: getActiveAccountObserve(!isDeactivate),
  }),
)<any>(memo(AccountList, isEqual));
