import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { SectionListData, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { Card, Empty, InputSearch, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import Item from './Item';
import { withObservables } from '@nozbe/watermelondb/react';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupDataByValue } from 'utils/algorithm';
import { SCREEN_HEIGHT } from 'share/dimensions';
import { fetchAccountData, getAccountsData } from 'services/api/accounts';
import styles from './styles';

type AccountListProps = {
  title?: string;
  isDeactivate?: boolean;
  isGroup?: boolean;
  isItemSelected?: string;
  isShowSearch?: boolean;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
  accountsObservables?: Observable<AccountModel[]>;
};

const maxHeight = SCREEN_HEIGHT * 0.55;

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
  const renderKey = useRef(0);

  useEffect(() => {
    if (!isDeactivate) {
      setActiveAccounts(accountsObservables);
    } else {
      const result = accountsObservables?.length ? [{ data: accountsObservables }] : [];
      setAccounts(result);
    }
  }, [isGroup, accountsObservables]);

  useEffect(() => {
    // change key to force-render collapse view
    renderKey.current = renderKey.current + 1;
    if (!Boolean(accounts.length) !== collapse) {
      setCollapse(!Boolean(accounts.length));
    }
  }, [accounts]);

  const setActiveAccounts = async (data: any) => {
    const dataGroup: any[] = groupDataByValue(data);
    setAccounts(dataGroup);
  };

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
    const res = await getAccountsData({ text });
    setActiveAccounts(res);
  };

  return (
    <>
      {isShowSearch && (
        <View style={{ margin: 5 }}>
          <InputSearch onChangeText={onInputChange} />
        </View>
      )}
      <Card
        title={title}
        disabled={!!isItemSelected}
        collapse={collapse}
        renderKey={renderKey.current}
        containerStyle={{ paddingVertical: 10 }}
      >
        <SectionListComponent
          style={{ maxHeight }}
          sections={accounts}
          initialNumToRender={8}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
        />
      </Card>
    </>
  );
}

export default withObservables(
  ['accountsObservables'],
  ({ isDeactivate = false }: AccountListProps) => ({
    accountsObservables: fetchAccountData(!isDeactivate),
  }),
)<any>(memo(AccountList, isEqual));
