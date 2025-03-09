import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SAVINGS, WALLET } from 'utils/constants/navigation.constant';

import Accounts from 'features/AccountDashboard';
import Savings from 'features/Savings';
import Loading from 'components/Loading';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();

function AccountTab() {
  const { colors } = useCustomTheme();
  return (
    <Tab.Navigator
      key={'AccountTabbar'}
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
        name={WALLET}
        options={{
          title: 'Ví Tiền',
        }}
        key={WALLET}
        component={Accounts}
      />
      <Tab.Screen
        key={SAVINGS}
        name={SAVINGS}
        options={{ title: 'Sổ Tiết kiệm' }}
        component={Savings}
      />
    </Tab.Navigator>
  );
}
export default AccountTab;
