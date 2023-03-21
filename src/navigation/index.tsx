import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME } from './constants';
import { RootStackParamList } from './types';

import HomeNavigation from './Home';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  return (
    <RootStack.Navigator initialRouteName={HOME} screenOptions={{ headerShown: false }}>
      <RootStack.Screen name={HOME} component={HomeNavigation} />
    </RootStack.Navigator>
  );
}

export default AppNavigators;
