import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { HOME } from './constants';
import HomeNavigation from './Home';
import { RootStackParamList } from './type';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();
const appOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

function AppNavigators() {
  return (
    <RootStack.Navigator initialRouteName={HOME} screenOptions={appOptions}>
      <RootStack.Screen name={HOME} component={HomeNavigation} />
    </RootStack.Navigator>
  );
}

export default AppNavigators;
