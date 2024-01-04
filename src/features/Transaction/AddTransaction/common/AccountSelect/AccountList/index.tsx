import React, { useCallback, useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { Empty, RNText } from 'components/index';
import { TAccount } from 'database/types';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupAccountDataByValue } from 'utils/algorithm';
import { getAccountData } from 'services/api/accounts';
import { TGetAllAccounts } from 'database/querying';
import { BottomSheetSectionList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useCustomTheme } from 'resources/theme';
import Item from './Item';
import styles from './styles';

type AccountListProps = {
  isItemSelected?: string;
  onActionPress?: (account: TAccount) => void;
  onItemPress?: (account: TAccount) => void;
  accountsObservables?: Observable<AccountModel[]>;
  excludeId?: string;
};

function AccountList({ isItemSelected, onItemPress, excludeId }: AccountListProps) {
  const { colors } = useCustomTheme();
  const [accounts, setAccounts] = useState<SectionListData<TAccount, any>>([]);

  useEffect(() => {
    getListAccount({ text: '', excludeId });
  }, [excludeId]);

  const getListAccount = ({ text = '', excludeId }: TGetAllAccounts) => {
    getAccountData({ text, excludeId }).then((res) => {
      const dataGroup: any[] = groupAccountDataByValue(res);
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

  const keyExtractor = useCallback((item: any) => item['id'], []);

  return (
    <View style={styles.wrapper}>
      <View style={{ marginBottom: 10 }}>
        <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
          <BottomSheetTextInput
            placeholder="Tìm kiếm tài khoản"
            style={{
              height: 46,
              paddingHorizontal: 20,
            }}
            onChangeText={onInputChange}
          />
        </View>
      </View>
      <BottomSheetSectionList
        sections={accounts}
        initialNumToRender={8}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Empty text="Không có tài khoản nào!" />}
      />
    </View>
  );
}

export default AccountList;
