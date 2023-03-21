import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeBottomBar from './HomeBottomBar';
import { SvgIcon } from 'components/index';
import { ACCOUNT, DASHBOARD, SETTINGS, TRANSACTIONS, REPORT } from '../constants';

// routes screen
import Settings from 'features/Settings';
import AccountNavigation from 'navigation/Account';
import Dashboard from 'features/Dashboard';
import TransactionNavigation from 'navigation/Transaction';
import ReportNavigation from 'navigation/Report';
import { HomeStackParamList } from 'navigation/types';

// set up routes
const BottomTab = createBottomTabNavigator<HomeStackParamList>();

function HomeNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={DASHBOARD}
      tabBar={(props) => <HomeBottomBar {...props} circle={TRANSACTIONS} />}
    >
      <BottomTab.Screen
        name={DASHBOARD}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="house" />,
          tabBarLabel: 'Tổng quan',
        }}
        component={Dashboard}
      />
      <BottomTab.Screen
        name={ACCOUNT}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="card" />,
          tabBarLabel: 'Tài khoản',
        }}
        component={AccountNavigation}
      />
      <BottomTab.Screen
        name={TRANSACTIONS}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="add" color="white" />,
        }}
        component={TransactionNavigation}
      />
      <BottomTab.Screen
        name={REPORT}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="report" size={26} />,
          tabBarLabel: 'Báo cáo',
        }}
        component={ReportNavigation}
      />
      <BottomTab.Screen
        name={SETTINGS}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="settings" />,
          tabBarLabel: 'Cài đặt',
        }}
        component={Settings}
      />
    </BottomTab.Navigator>
  );
}

export default HomeNavigation;
