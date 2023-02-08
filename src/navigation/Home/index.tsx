import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import HomeBottomBar from './HomeBottomBar';
import { SvgIcon } from 'components/index';
import { ACCOUNT, DASHBOARD, SETTINGS, TRANSACTIONS, REPORT } from '../constants';

// routes screen
import Settings from 'features/Settings';
import AddTransactions from 'features/AddTransaction';
import AccountNavigation from 'navigation/Account';
import Dashboard from 'features/Dashboard';

// set up routes
const Tab = createBottomTabNavigator();

// header config
const homeOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

function HomeNavigation() {
  return (
    <Tab.Navigator
      screenOptions={homeOptions}
      initialRouteName={DASHBOARD}
      tabBar={(props) => <HomeBottomBar {...props} circle={TRANSACTIONS} />}
    >
      <Tab.Screen
        name={DASHBOARD}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="house" />,
          tabBarLabel: 'Tổng quan',
        }}
        component={Dashboard}
      />
      <Tab.Screen
        name={ACCOUNT}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="card" />,
          tabBarLabel: 'Tài khoản',
        }}
        component={AccountNavigation}
      />
      <Tab.Screen
        name={TRANSACTIONS}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="add" color="white" />,
        }}
        component={AddTransactions}
      />
      <Tab.Screen
        name={REPORT}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="report" size={26} />,
          tabBarLabel: 'Báo cáo',
        }}
        component={Settings}
      />
      <Tab.Screen
        name={SETTINGS}
        options={{
          // @ts-ignore
          tabBarIcon: () => <SvgIcon name="settings" />,
          tabBarLabel: 'Cài đặt',
        }}
        component={Settings}
      />
    </Tab.Navigator>
  );
}

export default HomeNavigation;
