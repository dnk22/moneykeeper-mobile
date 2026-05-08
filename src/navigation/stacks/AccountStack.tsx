import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';

// header custom icon
import SharedScreens from './SharedStacks';
import AccountDashboard from 'features/account/AccountDashboard';

//set up routes
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function AccountNavigation() {
  return (
    <AccountStack.Navigator
      initialRouteName={ROUTES.ACCOUNT_TAB}
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <AccountStack.Screen
        name={ROUTES.ACCOUNT_TAB}
        options={({ navigation }) => ({
          title: 'Tài khoản',
        })}
        component={AccountDashboard}
      />
      {SharedScreens({ stack: AccountStack })}
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
