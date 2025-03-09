import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ACCOUNTTAB } from 'utils/constants/navigation.constant';
import { AccountStackParamList } from 'utils/types/navigation';
import { useCustomTheme } from 'resources/theme';
import CommonStack from '../stacks/CommonStack';

// header custom icon
import AccountTab from 'navigation/tabs/AccountTabs';
import Toolbar from 'navigation/components/AccountToolbar';
import Search from 'navigation/components/Search';

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
