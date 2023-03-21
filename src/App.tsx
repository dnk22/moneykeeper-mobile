import React, { useEffect } from 'react';
import { LogBox, useColorScheme, View } from 'react-native';
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
import { getIsBankDataExist, importDefaultBanksData } from 'database/querying';

LogBox.ignoreLogs(logBoxIgnore);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = MyAppTheme[isDarkMode ? 'dark' : 'default'];

  useEffect(() => {
    RnKeyboard.registerKeyboard('KeyboardCalculator', KeyboardCalculator);
  }, []);

  useEffect(() => {
    prepareBankData();
  }, []);

  async function prepareBankData() {
    const isBankExist = await getIsBankDataExist();
    if (!!!isBankExist) {
      importDefaultBanksData();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar />
        <PersistGate loading={<Loading />} persistor={persistor}>
          <NavigationContainer theme={theme}>
            <AppNavigators />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default App;
