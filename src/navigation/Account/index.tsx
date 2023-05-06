import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ACCOUNTTAB,
  ADD_ACCOUNT,
  ACCOUNT_DETAIL,
  CREATE_TRANSACTION_FROM_ACCOUNT,
} from 'navigation/constants';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

import AccountTab from './tab';
import AddAccount from 'features/AddAccount';
import TransactionListByAccount from 'features/TransactionListByAccount';

// header custom icon
import Submit from 'navigation/elements/Submit';
import Search from 'navigation/elements/Search';
import Toolbar from './component/Toolbar';
import AddTransactions from 'features/Transaction/AddTransaction';

// lazy import
// const AccountTab = React.lazy(() => import('./tab'));
// const AddAccount = React.lazy(() => import('features/AddAccount'));
// const AccountDetails = React.lazy(() => import('features/AccountDetails'));
// const BankNavigation = React.lazy(() => import('navigation/Bank'));
// const TransactionNavigation = React.lazy(() => import('navigation/Transaction'));

//set up routes
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function AccountNavigation() {
  const { colors } = useCustomTheme();
  return (
    <AccountStack.Navigator
      initialRouteName={ACCOUNTTAB}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
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
        })}
        component={AddAccount}
      />
      <AccountStack.Screen
        name={ACCOUNT_DETAIL}
        options={({ route }) => ({
          title: route.params?.accountName,
          headerBackTitleVisible: false,
          headerRight: (props) => <Submit {...props} />,
        })}
        component={TransactionListByAccount}
      />
      <AccountStack.Screen name={CREATE_TRANSACTION_FROM_ACCOUNT} component={AddTransactions} />
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
