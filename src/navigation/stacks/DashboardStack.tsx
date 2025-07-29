import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';

// import route component
import Dashboard from 'features/Dashboard';
import Notification from 'features/common/Notifications';
import SharedScreens from './SharedStacks';

//set up routes
const TransactionStack = createNativeStackNavigator<DashboardParamList>();

function DashboardNavigation() {
  const { colors } = useCustomTheme();

  return (
    <TransactionStack.Navigator
      initialRouteName={ROUTES.DASHBOARD_HOME}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
      <TransactionStack.Screen
        name={ROUTES.DASHBOARD_HOME}
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <TransactionStack.Screen
        name={ROUTES.NOTIFICATION}
        component={Notification}
        options={{ title: 'Thông báo' }}
      />
      {/* Shared screens */}
      {SharedScreens({ stack: TransactionStack, screens: [ROUTES.ADD_ACCOUNT] })}
    </TransactionStack.Navigator>
  );
}

export default DashboardNavigation;
