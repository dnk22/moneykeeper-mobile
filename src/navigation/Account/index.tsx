import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNTTAB, ADDWALLET } from 'navigation/constants';
import { AccountStackParamList } from 'navigation/type';
import { useCustomTheme } from 'resources/theme';

import AccountTab from './tab';
import AddWallet from 'features/AddWallet';

// header custom icon
import Submit from './component/Submit';
import Toolbar from './component/Toolbar';
import Search from './component/Search';
import isEqual from 'react-fast-compare';

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
        name={ADDWALLET}
        options={({ route }) => ({
          title: route.params?.accountId ? 'Sửa tài khoản' : 'Thêm tài khoản',
          headerRight: (props) => <Submit {...props} />,
        })}
        component={AddWallet}
      />
    </AccountStack.Navigator>
  );
}

export default memo(AccountNavigation, isEqual);
