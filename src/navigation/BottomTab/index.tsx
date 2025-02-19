import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ACCOUNT,
  DASHBOARD,
  SETTINGS,
  TRANSACTIONS,
  REPORT,
} from 'utils/constants/navigation.constant';
import HomeBottomBar from '../elements/HomeBottomBar';

// routes screen
import AccountNavigation from 'navigation/Account';
import TransactionNavigation from 'navigation/Transaction';
import ReportNavigation from 'navigation/Report';
import DashboardNavigation from 'navigation/Dashboard';
import SettingsNavigation from 'navigation/Settings';
import { BottomTabStackList } from 'utils/types/navigation';
import SvgIcon from 'components/SvgIcon';

// set up routes
const BottomTab = createBottomTabNavigator<BottomTabStackList>();

function RootNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={DASHBOARD}
      tabBar={(props) => <HomeBottomBar {...props} />}
    >
      <BottomTab.Screen
        name={DASHBOARD}
        options={{
          // @ts-ignore
          tabBarIcon: ({ color }) => <SvgIcon name="house" color={color} />,
          tabBarLabel: 'Tổng quan',
        }}
        component={DashboardNavigation}
      />
      <BottomTab.Screen
        name={ACCOUNT}
        options={{
          // @ts-ignore
          tabBarIcon: ({ color }) => <SvgIcon name="card" color={color} />,
          tabBarLabel: 'Tài khoản',
        }}
        component={AccountNavigation}
      />
      <BottomTab.Screen
        name={TRANSACTIONS}
        options={{
          // @ts-ignore
          tabBarIcon: ({ color }) => <SvgIcon name="add" color={color} />,
        }}
        component={TransactionNavigation}
      />
      <BottomTab.Screen
        name={REPORT}
        options={{
          // @ts-ignore
          tabBarIcon: ({ color }) => <SvgIcon name="report" size={26} color={color} />,
          tabBarLabel: 'Báo cáo',
        }}
        component={ReportNavigation}
      />
      <BottomTab.Screen
        name={SETTINGS}
        options={{
          // @ts-ignore
          tabBarIcon: ({ color }) => <SvgIcon name="more" color={color} />,
          tabBarLabel: 'Cài đặt',
        }}
        component={SettingsNavigation}
      />
    </BottomTab.Navigator>
  );
}

export default RootNavigation;
