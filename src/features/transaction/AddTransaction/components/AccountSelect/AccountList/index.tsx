import React, { useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import FlatListComponent from 'components/FlatList';
import Empty from 'components/Empty';
import RNText from 'components/Text';
import { TAccount } from 'database/types';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { AccountModel } from 'database/models';
import { groupAccountDataByKey } from 'utils/algorithm';
import { accountLocalQuery, TGetAllAccountsOptions } from 'database/querying';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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

  const getListAccount = ({ text = '', excludeId }: TGetAllAccountsOptions) => {
    accountLocalQuery.getAccounts({ text, excludeId }).then((res) => {
      const dataGroup: any[] = groupAccountDataByKey(res);
      setAccounts(dataGroup);
    });
  };

  const onInputChange = async (text: string) => {
    getListAccount({ text, excludeId });
  };

  const renderItem = ({ item }: { item: Partial<TAccount> & { title: string; accountTypeId: number } }) => {
    if (item.title) {
      // Rendering header
      return <RNText preset="subTitle" >{item.title}</RNText>;
    } else {
      // Render item
      return <Item account={item} onItemPress={onItemPress} isItemSelected={isItemSelected} />
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={{ marginBottom: 10 }}>
        <View style={[styles.inputGroup, { backgroundColor: colors.surface }]}>
          <BottomSheetTextInput
            placeholder="Tìm kiếm tài khoản"
            style={styles.inputSearch}
            onChangeText={onInputChange}
          />
        </View>
      </View>
      <FlatListComponent
        gap={5}
        data={accounts}
        renderItem={renderItem}
        ListEmptyComponent={<Empty title="Bạn chưa có tài khoản nào!" />}
        getItemType={(item) => {
          return item.title ? "sectionHeader" : "row";
        }}
      />
    </View>
  );
}

export default AccountList;
