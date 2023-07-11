import { memo, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import InputSelection from 'components/InputSelection';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isEqual } from 'lodash';
import { ACCOUNT_PICKER } from 'navigation/constants';
import { getAccountById } from 'database/querying';

type AccountProp = {
  accountLogo: string;
  accountName: string;
};

type AccountSelectProps = {
  name?: string;
  value?: string;
  control: any;
  error: any;
  onReset: any;
  title?: string;
};

function AccountSelect({
  name = 'accountId',
  value,
  control,
  error,
  onReset,
  title = 'Chọn tài khoản',
}: AccountSelectProps) {
  const navigation = useNavigation();
  const [accountSelected, setAccountSelected] = useState<AccountProp | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [value]),
  );

  useEffect(() => {
    fetchAccountData();
  }, [value]);

  const handleOnSelectAccount = () => {
    navigation.navigate(ACCOUNT_PICKER, { accountSelectedId: value });
  };

  const fetchAccountData = async () => {
    if (!value) {
      return false;
    }
    try {
      const account = await getAccountById(value);
      if (!account) {
        resetAccountState();
        return false;
      }
      const newAccountState = {
        accountLogo: account.accountLogo,
        accountName: account.accountName,
      };
      // if data no change , don't setState
      if (!isEqual(newAccountState, accountSelected)) {
        setAccountSelected(newAccountState);
      }
      return true;
    } catch (error) {
      Alert.alert('Oops, Lỗi rồi!', 'Có lỗi trong quá trình chọn tài khoản');
      return false;
    }
  };

  const resetAccountState = () => {
    setAccountSelected(undefined);
    onReset();
  };

  return (
    <InputSelection
      required
      icon={accountSelected?.accountLogo}
      value={accountSelected?.accountName}
      title={title}
      name={name}
      control={control}
      error={error}
      onSelect={handleOnSelectAccount}
    />
  );
}
export default memo(AccountSelect);
