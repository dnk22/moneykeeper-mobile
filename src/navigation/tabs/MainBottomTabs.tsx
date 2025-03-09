import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ACCOUNT,
  DASHBOARD,
  SETTINGS,
  TRANSACTIONS,
  REPORT,
} from 'utils/constants/navigation.constant';

// routes screen
import AccountNavigation from '../stacks/AccountStack';
import TransactionNavigation from '../stacks/TransactionStack';
import ReportNavigation from '../stacks/ReportStack';
import DashboardNavigation from '../stacks/DashboardStack';
import SettingsNavigation from '../stacks/SettingsStack';
import { MainTabStackParamsList } from 'navigation/types';
import { Home2, Wallet3, DocumentFilter, ElementPlus, AddCircle } from 'iconsax-react-native';
import MainBottomBar from 'navigation/components/MainBottomBar';

// set up routes
const BottomTab = createBottomTabNavigator<MainTabStackParamsList>();

function MainNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={DASHBOARD}
      tabBar={(props) => <MainBottomBar {...props} />}
    >
      <BottomTab.Screen
        name={DASHBOARD}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home2 size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Tổng quan',
        }}
        component={DashboardNavigation}
      />
      <BottomTab.Screen
        name={ACCOUNT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Wallet3 size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Tài khoản',
        }}
        component={AccountNavigation}
      />
      <BottomTab.Screen
        name={TRANSACTIONS}
        options={{
          tabBarIcon: ({ focused }) => (
            <AddCircle size={26} color="white" variant={focused ? 'Bold' : 'Broken'} />
          ),
        }}
        component={TransactionNavigation}
      />
      <BottomTab.Screen
        name={REPORT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <DocumentFilter size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Báo cáo',
        }}
        component={ReportNavigation}
      />
      <BottomTab.Screen
        name={SETTINGS}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ElementPlus size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Cài đặt',
        }}
        component={SettingsNavigation}
      />
    </BottomTab.Navigator>
  );
}

export default MainNavigation;
