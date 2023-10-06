import React from 'react';
import AccountList from 'features/AccountList';
import { TAccount } from 'database/types/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from 'navigation/types';
import { ACCOUNT_PICKER, ADD_TRANSACTION } from 'navigation/constants';

function AccountPicker() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RootStackScreenProps<typeof ACCOUNT_PICKER>['route']>();

  const handleOnItemPress = (account: TAccount) => {
    navigation.navigate(ADD_TRANSACTION, { accountId: account.id });
  };

  return (
    <AccountList
      isGroup
      isShowSearch
      isItemSelected={params?.accountSelectedId}
      onItemPress={handleOnItemPress}
      disabledCard
    />
  );
}
export default AccountPicker;
