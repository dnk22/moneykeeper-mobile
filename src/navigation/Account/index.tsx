import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNTTAB, ADD_ACCOUNT, ACCOUNT_DETAIL } from 'navigation/constants';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';
import isEqual from 'react-fast-compare';

import AccountTab from './tab';
import AddAccount from 'features/AddAccount';

// header custom icon
import Submit from './component/Submit';
import Toolbar from './component/Toolbar';
import Search from './component/Search';
import AccountDetails from 'features/AccountDetails';

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
          headerLeft: (props) => <Toolbar {...props} />,
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
          headerRight: (props) => <Submit {...props} />,
        })}
        component={AccountDetails}
      />
    </AccountStack.Navigator>
  );
}

export default memo(AccountNavigation, isEqual);
