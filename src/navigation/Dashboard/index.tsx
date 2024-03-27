import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DASHBOARDHOME, NOTIFICATION } from 'navigation/constants';
import { DashboardParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

// import route component
import Dashboard from 'features/Dashboard';
import Notification from 'features/Notification';
import CommonStack from 'navigation/CommonStack';

//set up routes
const TransactionStack = createNativeStackNavigator<DashboardParamList>();

function DashboardNavigation() {
  const { colors } = useCustomTheme();

  return (
    <TransactionStack.Navigator
      initialRouteName={DASHBOARDHOME}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
        headerBackTitleVisible: false,
      }}
    >
      <TransactionStack.Screen
        name={DASHBOARDHOME}
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <TransactionStack.Screen
        name={NOTIFICATION}
        component={Notification}
        options={{ title: 'Thông báo' }}
      />
      <TransactionStack.Group>{CommonStack({ Stack: TransactionStack })}</TransactionStack.Group>
    </TransactionStack.Navigator>
  );
}

export default DashboardNavigation;
