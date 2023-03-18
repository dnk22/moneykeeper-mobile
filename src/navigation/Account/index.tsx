import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ACCOUNTTAB,
  ADD_ACCOUNT,
  ACCOUNT_DETAIL,
  BANK_NAVIGATION,
  CREATE_TRANSACTION_FROM_ACCOUNT,
} from 'navigation/constants';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

import AccountTab from './tab';
import AddAccount from 'features/AddAccount';

// header custom icon
import Submit from './component/Submit';
import Toolbar from './component/Toolbar';
import Search from './component/Search';
import AccountDetails from 'features/AccountDetails';
import BankNavigation from 'navigation/Bank';
import TransactionNavigation from 'navigation/Transaction';
import SelectTransactionType from 'navigation/common/SelectTransactionType';
import Done from 'navigation/common/Done';

//set up routes
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function AccountNavigation() {
  const { colors } = useCustomTheme();
  const rootOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: 'white',
  };

  return (
    <AccountStack.Navigator initialRouteName={ACCOUNTTAB} screenOptions={rootOptions}>
      <AccountStack.Screen
        name={ACCOUNTTAB}
        options={{
          title: 'Tài khoản',
          headerBackTitleVisible: false,
          headerLeft: () => <Toolbar />,
          headerRight: (props) => <Search {...props} />,
        }}
        component={AccountTab}
      />
      <AccountStack.Screen
        name={ADD_ACCOUNT}
        options={({ route }) => ({
          title: route.params?.accountId ? 'Sửa tài khoản' : 'Thêm tài khoản',
          headerRight: (props) => <Submit {...props} />,
        })}
        component={AddAccount}
      />
      <AccountStack.Screen
        name={ACCOUNT_DETAIL}
        options={() => ({
          headerBackTitleVisible: false,
          headerRight: (props) => <Submit {...props} />,
        })}
        component={AccountDetails}
      />
      <AccountStack.Screen
        name={BANK_NAVIGATION}
        component={BankNavigation}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <AccountStack.Screen
        name={CREATE_TRANSACTION_FROM_ACCOUNT}
        component={TransactionNavigation}
        options={{
          headerTitle: () => <SelectTransactionType />,
          headerRight: () => <Done />,
        }}
      />
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
