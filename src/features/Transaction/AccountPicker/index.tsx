import { View } from 'react-native';
import AccountList from 'features/AccountList';
import { TAccount } from 'database/types/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AccountPickerProp } from 'navigation/types';
import { ADD_TRANSACTION } from 'navigation/constants';

function AccountPicker() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<AccountPickerProp>();

  const handleOnItemPress = (account: TAccount) => {
    navigation.navigate(ADD_TRANSACTION, { accountId: account.id });
  };

  return (
    <View style={{ padding: 10 }}>
      <AccountList
        isGroup
        isShowSearch
        isItemSelected={params?.accountSelectedId}
        onItemPress={handleOnItemPress}
      />
    </View>
  );
}
export default AccountPicker;
