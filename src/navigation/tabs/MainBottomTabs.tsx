import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from 'navigation/constants/routes';
import { Home2, Wallet3, DocumentFilter, ElementPlus, AddCircle } from 'iconsax-react-native';
import MainBottomBar from 'navigation/components/MainBottomBar';
import { MainTabStackParamsList } from 'navigation/types';

// routes screen
import AccountNavigation from '../stacks/AccountStack';
import TransactionNavigation from '../stacks/TransactionStack';
import ReportNavigation from '../stacks/ReportStack';
import DashboardNavigation from '../stacks/DashboardStack';
import SettingsNavigation from '../stacks/SettingsStack';

// set up routes
const BottomTab = createBottomTabNavigator<MainTabStackParamsList>();

function MainNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false, headerBackButtonDisplayMode: 'minimal' }}
      initialRouteName={ROUTES.DASHBOARD}
      tabBar={(props) => <MainBottomBar {...props} />}
    >
      <BottomTab.Screen
        name={ROUTES.DASHBOARD}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home2 size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Tổng quan',
        }}
        component={DashboardNavigation}
      />
      <BottomTab.Screen
        name={ROUTES.ACCOUNT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Wallet3 size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Tài khoản',
        }}
        component={AccountNavigation}
      />
      <BottomTab.Screen
        name={ROUTES.TRANSACTIONS}
        options={{
          tabBarIcon: ({ focused }) => (
            <AddCircle size={26} color="white" variant={focused ? 'Bold' : 'Broken'} />
          ),
        }}
        component={TransactionNavigation}
      />
      <BottomTab.Screen
        name={ROUTES.REPORT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <DocumentFilter size={25} color={color} variant={focused ? 'Bold' : 'Broken'} />
          ),
          tabBarLabel: 'Báo cáo',
        }}
        component={ReportNavigation}
      />
      <BottomTab.Screen
        name={ROUTES.SETTINGS}
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
