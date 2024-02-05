import { SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DASHBOARDHOME, NOTIFICATION } from 'navigation/constants';
import { DashboardParamList } from 'navigation/types';
import { useCustomTheme } from 'resources/theme';

// import route component
import Dashboard from 'features/Dashboard';
import Notification from 'features/Notification';

//set up routes
const TransactionStack = createNativeStackNavigator<DashboardParamList>();

function DashboardNavigation() {
  const { colors } = useCustomTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <TransactionStack.Navigator
        initialRouteName={DASHBOARDHOME}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white',
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
          options={{ title: 'Thông báo', headerBackTitleVisible: false }}
        />
      </TransactionStack.Navigator>
    </SafeAreaView>
  );
}

export default DashboardNavigation;
