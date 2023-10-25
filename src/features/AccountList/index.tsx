import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { SectionListData, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { Empty, InputSearch, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import { withObservables } from '@nozbe/watermelondb/react';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupDataByValue } from 'utils/algorithm';
import { SCREEN_HEIGHT } from 'share/dimensions';
import { fetchAccountData, getAccountsData } from 'services/api/accounts';
import Collapsible from 'react-native-collapsible';
import Header from './Header';
import Item from './Item';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

type AccountListProps = {
  title?: string;
  isDeactivate?: boolean;
  enabledCard?: boolean;
  isGroup?: boolean;
  isItemSelected?: string;
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
  enabledCard,
  isGroup = false,
  isItemSelected,
  onActionPress,
  onItemPress,
  accountsObservables,
}: AccountListProps) {
  const { colors } = useCustomTheme();
  const renderKey = useRef(0);
  const [collapse, setCollapse] = useState(false);
  const [accounts, setAccounts] = useState<SectionListData<TAccount, any>>([]);

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
    if (!Boolean(accounts.length) !== collapse && enabledCard) {
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
      return <RNText color="#747471">{`${title}`}</RNText>;
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

  const onHeaderPress = () => {
    setCollapse(!collapse);
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: enabledCard ? colors.surface : undefined }]}>
      {!enabledCard && (
        <View style={{ marginBottom: 10 }}>
          <InputSearch onChangeText={onInputChange} />
        </View>
      )}
      {enabledCard && <Header onPress={onHeaderPress} title={title} isActive={collapse} />}
      <Collapsible collapsed={collapse} key={renderKey.current}>
        <SectionListComponent
          style={{ maxHeight }}
          sections={accounts}
          initialNumToRender={8}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
        />
      </Collapsible>
    </View>
  );
}

export default withObservables(
  ['accountsObservables'],
  ({ isDeactivate = false }: AccountListProps) => ({
    accountsObservables: fetchAccountData(!isDeactivate),
  }),
)<any>(memo(AccountList, isEqual));
