import { useCallback, useState } from 'react';
import { View } from 'react-native';
import AccountList from 'features/AccountList';
import { useAppDispatch, useAppSelector } from 'store/index';
import { groupDataByValue } from 'utils/algorithm';
import styles from './styles';
import { TAccount } from 'database/types/index';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setAccountSelected } from 'store/transactions/transactions.slice';
import { selectAccountSelected } from 'store/transactions/transactions.selector';
import { getAccounts } from 'database/querying/accounts.query';

function AccountPicker() {
  const useDispatch = useAppDispatch();
  const navigation = useNavigation();
  const [activeAccount, setActiveAccount] = useState<any>([]);
  const getAccountSelected = useAppSelector((state) => selectAccountSelected(state));

  useFocusEffect(
    useCallback(() => {
      getActiveAccount();
    }, []),
  );

  const groupAccount = useCallback((account: any) => groupDataByValue(account), []);

  const getActiveAccount = async () => {
    const activateAccount = await getAccounts({ isActive: true });
    const group = groupAccount(activateAccount);
    setActiveAccount(group);
  };

  const handleOnItemPress = (account: TAccount) => {
    useDispatch(setAccountSelected(account));
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <AccountList
        data={activeAccount}
        onItemPress={handleOnItemPress}
        isItemSelected={getAccountSelected?.id}
      />
    </View>
  );
}
export default AccountPicker;
