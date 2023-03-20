import { useCallback, useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { InputSearch, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import Item from './Item';
import withObservables from '@nozbe/with-observables';
import styles from './styles';
import { getAccounts, getActiveAccountObserve } from 'database/querying';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupDataByValue } from 'utils/algorithm';

type AccountListProps = {
  isDeactivate?: boolean;
  isGroup?: boolean;
  isItemSelected?: string;
  isShowSearch?: boolean;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
  accountsObservables?: Observable<AccountModel[]>;
};

const AccountItemObserve = withObservables(['account'], ({ account }) => ({
  account: account.observe(),
}))(Item);

function AccountList({
  isDeactivate,
  isGroup = false,
  isShowSearch = false,
  isItemSelected,
  onActionPress,
  onItemPress,
  accountsObservables,
}: AccountListProps) {
  const [accounts, setAccounts] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    if (!isDeactivate) {
      setActiveAccounts(accountsObservables);
    }
  }, [isGroup, accountsObservables]);

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
          <RNText>{`${title}`}</RNText>
        </View>
      );
    },
    [isGroup],
  );

  const renderItem = ({ item }: { item: TAccount }) => {
    return (
      <AccountItemObserve
        account={item}
        onActionPress={onActionPress}
        onItemPress={onItemPress}
        isItemSelected={isItemSelected}
      />
    );
  };

  const onInputChange = async (text: string) => {
    const res = await getAccounts({ text });
    setActiveAccounts(res);
  };

  return (
    <>
      {isShowSearch && <InputSearch onChangeText={onInputChange} />}
      <SectionListComponent
        style={{ maxHeight: 350 }}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={accounts}
        ListEmptyComponent={<Empty />}
      />
    </>
  );
}

function Empty() {
  return (
    <View style={{ alignItems: 'center' }}>
      <RNText color="red">Không có tài khoản nào!</RNText>
    </View>
  );
}

export default withObservables(
  ['accountsObservables'],
  ({ isDeactivate = false }: AccountListProps) => ({
    accountsObservables: getActiveAccountObserve(!isDeactivate),
  }),
)<any>(AccountList);
