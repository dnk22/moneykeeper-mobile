import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';

// header custom icon
import AccountTab from 'navigation/tabs/AccountTabs';
import Toolbar from 'navigation/components/AccountToolbar';
import Search from 'navigation/components/Search';
import SharedScreens from './SharedStacks';

//set up routes
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function AccountNavigation() {
  const { colors } = useCustomTheme();
  return (
    <AccountStack.Navigator
      initialRouteName={ROUTES.ACCOUNT_TAB}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
        title: '',
      }}
    >
      <AccountStack.Screen
        name={ROUTES.ACCOUNT_TAB}
        options={{
          title: 'Tài khoản',
          headerLeft: () => <Toolbar />,
          headerRight: () => <Search />,
        }}
        component={AccountTab}
      />
      {SharedScreens({ stack: AccountStack, screens: 'all' })}
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
