import { View } from 'react-native';
import AccountList from 'features/AccountList';
import { selectActiveAccounts } from 'store/account/account.selector';
import { useAppDispatch, useAppSelector } from 'store/index';
import { groupDataByValue } from 'utils/algorithm';
import styles from './styles';
import { TAccount } from 'types/models';
import { useNavigation } from '@react-navigation/native';
import { setAccountSelected } from 'store/transactions/transactions.slice';
import { selectAccountSelected } from 'store/transactions/transactions.selector';

function AccountPicker() {
  const useDispatch = useAppDispatch();
  const navigation = useNavigation();

  const getActiveAccounts = useAppSelector((state) => selectActiveAccounts(state));
  const groupAccounts = groupDataByValue(getActiveAccounts);
  const getAccountSelected = useAppSelector((state) => selectAccountSelected(state));

  const handleOnItemPress = (account: TAccount) => {
    useDispatch(setAccountSelected(account));
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <AccountList
        data={groupAccounts}
        onItemPress={handleOnItemPress}
        isItemSelected={getAccountSelected?._id}
      />
    </View>
  );
}
export default AccountPicker;
