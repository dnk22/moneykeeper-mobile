import React, { useEffect } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import AppNavigators from 'navigation/index';
import { MyAppTheme } from 'resources/theme';
import { PersistGate } from 'redux-persist/integration/react';
import { logBoxIgnore } from 'utils/constant';
import { Loading, StatusBar } from 'components/index';
import RnKeyboard from 'rn-keyboard'; // <-- Import here
import KeyboardCalculator from 'components/InputCalculator/KeyboardCalculator';

LogBox.ignoreLogs(logBoxIgnore);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    RnKeyboard.registerKeyboard('KeyboardCalculator', KeyboardCalculator);
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <NavigationContainer theme={MyAppTheme[isDarkMode ? 'dark' : 'default']}>
          <StatusBar />
          <AppNavigators />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
