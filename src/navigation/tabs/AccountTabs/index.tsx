import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ROUTES } from 'navigation/constants/routes';
import Accounts from 'features/account/AccountDashboard';
import Savings from 'features/Savings';
import Loading from 'components/Loading';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();

function AccountTab() {
  const { colors } = useCustomTheme();
  return (
    <Tab.Navigator
      key={ROUTES.ACCOUNT_TAB}
      screenOptions={{
        lazy: true,
        lazyPlaceholder: () => <Loading style={{ flex: 1 }} />,
        tabBarContentContainerStyle: styles.tabBarContentContainerStyle,
        tabBarIndicatorStyle: [styles.indicator, { backgroundColor: colors.primary }],
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name={ROUTES.WALLET}
        options={{
          title: 'Ví Tiền',
        }}
        key={ROUTES.WALLET}
        component={Accounts}
      />
      <Tab.Screen
        key={ROUTES.SAVINGS}
        name={ROUTES.SAVINGS}
        options={{ title: 'Sổ Tiết kiệm' }}
        component={Savings}
      />
    </Tab.Navigator>
  );
}
export default AccountTab;
