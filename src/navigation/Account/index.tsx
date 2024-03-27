import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNTTAB } from 'navigation/constants';
import { AccountStackParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';
import AccountTab from './tab';

// header custom icon
import Search from 'navigation/elements/Search';
import Toolbar from './component/Toolbar';
import CommonStack from 'navigation/CommonStack';

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
        }}
        component={AccountTab}
      />
      <AccountStack.Group>{CommonStack({ Stack: AccountStack })}</AccountStack.Group>
    </AccountStack.Navigator>
  );
}

export default AccountNavigation;
