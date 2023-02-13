import { View } from 'react-native';
import AccountList from 'features/Accounts/AccountList';
import { selectActiveAccounts } from 'store/account/account.selector';
import { useAppSelector } from 'store/index';
import { groupDataByValue } from 'utils/algorithm';
import styles from './styles';
import { TAccount } from 'types/models';
import { useRoute } from '@react-navigation/native';

function AccountPicker() {
  const { params } = useRoute();
  const getActiveAccounts = useAppSelector((state) => selectActiveAccounts(state));
  const groupAccounts = groupDataByValue(getActiveAccounts);

  const handleOnItemPress = (account: TAccount) => {
    console.log(account);
  };
  return (
    <View style={styles.container}>
      <AccountList
        data={groupAccounts}
        onItemPress={handleOnItemPress}
        isItemSelected={params?.account_id}
      />
    </View>
  );
}
export default AccountPicker;
