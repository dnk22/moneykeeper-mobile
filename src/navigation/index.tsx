import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BANK_NAVIGATION, HOME } from './constants';
import { RootStackParamList } from './types';

import HomeNavigation from './Home';
import BankNavigation from './Bank';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();
const appOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

function AppNavigators() {
  return (
    <RootStack.Navigator initialRouteName={HOME} screenOptions={appOptions}>
      <RootStack.Screen name={HOME} component={HomeNavigation} />
      <RootStack.Screen
        name={BANK_NAVIGATION}
        component={BankNavigation}
        options={{ presentation: 'modal' }}
      />
    </RootStack.Navigator>
  );
}

export default AppNavigators;
