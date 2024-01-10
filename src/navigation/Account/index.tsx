import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ACCOUNTTAB,
  ADD_ACCOUNT,
  ACCOUNT_NORMAL_DETAIL,
  CREATE_TRANSACTION_FROM_ACCOUNT,
  ACCOUNT_CREDIT_CARD_DETAIL,
} from 'navigation/constants';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

import AccountTab from './tab';
import AddAccount from 'features/AddAccount';
import TransactionHistoryNormal from 'features/TransactionHistory/NormalAccount';
import TransactionHistoryCreditCard from 'features/TransactionHistory/CreditCardAccount';

// header custom icon
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
        title: '',
        headerBackTitleVisible: false,
      }}
    >
      <AccountStack.Screen
        name={ACCOUNTTAB}
        options={{
          title: 'Tài khoản',
          headerLeft: () => <Toolbar />,
          headerRight: (props) => <Search {...props} />,
          headerBackTitleVisible: false,
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
        name={ACCOUNT_NORMAL_DETAIL}
        options={({ route }) => ({
          title: route.params?.accountName,
        })}
        component={TransactionHistoryNormal}
      />
      <AccountStack.Screen
        name={ACCOUNT_CREDIT_CARD_DETAIL}
        options={({ route }) => ({
          title: route.params?.accountName,
        })}
        component={TransactionHistoryCreditCard}
      />
      <AccountStack.Screen name={CREATE_TRANSACTION_FROM_ACCOUNT} component={AddTransactions} />
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
