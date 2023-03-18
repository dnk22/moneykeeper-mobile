import { View } from 'react-native';
import AccountList from 'features/AccountList';
import { useAppDispatch } from 'store/index';
import { TAccount } from 'database/types/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setTransactionAccountSelected } from 'store/transactions/transactions.slice';
import { AccountPickerProp } from 'navigation/types';

function AccountPicker() {
  const useDispatch = useAppDispatch();
  const navigation = useNavigation();
  const { params } = useRoute<AccountPickerProp>();

  const handleOnItemPress = (account: TAccount) => {
    const result = {
      accountName: account.accountName,
      accountLogo: account.accountLogo,
    };
    useDispatch(setTransactionAccountSelected(result));
    navigation.goBack();
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
