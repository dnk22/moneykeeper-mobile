import React, { useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { Empty, InputSearch, RNText, SectionListComponent } from 'components/index';
import { TAccount } from 'database/types/index';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupDataByValue } from 'utils/algorithm';
import { SCREEN_HEIGHT } from 'share/dimensions';
import { getAccountData } from 'services/api/accounts';
import { TGetAllAccounts } from 'database/querying';
import Item from './Item';
import styles from './styles';

type AccountListProps = {
  isItemSelected?: string;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
  accountsObservables?: Observable<AccountModel[]>;
  excludeId?: string;
};

const maxHeight = SCREEN_HEIGHT * 0.55;

function AccountList({ isItemSelected, onItemPress, excludeId }: AccountListProps) {
  const [accounts, setAccounts] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    getListAccount({ text: '', excludeId });
  }, [excludeId]);

  const getListAccount = ({ text = '', excludeId }: TGetAllAccounts) => {
    getAccountData({ text, excludeId }).then((res) => {
      const dataGroup: any[] = groupDataByValue(res);
      setAccounts(dataGroup);
    });
  };

  const onInputChange = async (text: string) => {
    getListAccount({ text, excludeId });
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return <Item account={item} onItemPress={onItemPress} isItemSelected={isItemSelected} />;
  };

  const renderSectionHeader = ({ section }: { section: SectionListData<TAccount> }) => {
    const { title } = section;
    return <RNText color="#747471">{`${title}`}</RNText>;
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ marginBottom: 10 }}>
        <InputSearch onChangeText={onInputChange} />
      </View>
      <SectionListComponent
        style={{ maxHeight }}
        sections={accounts}
        initialNumToRender={8}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
      />
    </View>
  );
}

export default AccountList;
