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
import AccountDetails from 'features/AccountDetails';
import BankNavigation from 'navigation/Bank';
import TransactionNavigation from 'navigation/Transaction';

// header custom icon
import Done from 'navigation/common/Done';
import SelectTransactionType from 'navigation/common/SelectTransactionType';
import Submit from 'navigation/common/Submit';
import Search from 'navigation/common/Search';
import Toolbar from './component/Toolbar';

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
    <AccountStack.Navigator initialRouteName={ACCOUNTTAB} screenOptions={{
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: 'white',
    }}>
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
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
        component={BankNavigation}
      />
      <AccountStack.Screen
        name={CREATE_TRANSACTION_FROM_ACCOUNT}
        options={{
          headerTitle: () => <SelectTransactionType />,
          headerRight: () => <Done />,
        }}
        component={TransactionNavigation}
      />
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
