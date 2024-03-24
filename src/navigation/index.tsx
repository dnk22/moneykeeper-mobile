import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  APPEARANCE,
  BANK_NAVIGATION,
  HOME,
  TRANSACTION_CATEGORY,
  WIDGET_SETTINGS,
} from './constants';
import { RootStackParamList } from './types';
import TransactionCategoryNavigation from './TransactionCategory';
import HomeNavigation from './Home';
import BankNavigation from './Bank';
import Appearance from 'features/Settings/Appearance';
import WidgetSettings from 'features/Dashboard/WidgetSettings';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  return (
    <RootStack.Navigator
      initialRouteName={HOME}
      screenOptions={{
        headerShown: false,
        autoHideHomeIndicator: true,
      }}
    >
      <RootStack.Screen name={HOME} component={HomeNavigation} />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name={BANK_NAVIGATION} component={BankNavigation} />
        <RootStack.Screen name={TRANSACTION_CATEGORY} component={TransactionCategoryNavigation} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ headerShown: true }}>
        <RootStack.Screen
          name={APPEARANCE}
          component={Appearance}
          options={{
            title: 'Giao diện',
          }}
        />
        <RootStack.Screen
          name={WIDGET_SETTINGS}
          component={WidgetSettings}
          options={{
            title: 'Chỉnh sửa DS Widget',
            presentation: 'containedModal',
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

export default AppNavigators;
