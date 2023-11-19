import React, { useEffect } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import AppNavigators from 'navigation/index';
import { MyAppTheme } from 'resources/theme';
import { PersistGate } from 'redux-persist/integration/react';
import { Loading, StatusBar } from 'components/index';

import RnKeyboard from 'rn-keyboard'; // <-- Import here
import KeyboardCalculator from 'features/Transaction/AddTransaction/common/InputCalculator/KeyboardCalculator';
import {
  getIsBankDataExist,
  getIsTransactionCategoryDataExist,
  importDefaultBanksData,
  importDefaultTransactionCategory,
} from 'database/querying';
import BlurScreen from 'features/BlurScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = MyAppTheme[isDarkMode ? 'dark' : 'default'];

  useEffect(() => {
    RnKeyboard.registerKeyboard('KeyboardCalculator', KeyboardCalculator);
  }, []);

  useEffect(() => {
    prepareBankData();
    prepareTransactionCategoryData();
  }, []);

  async function prepareBankData() {
    const isBankExist = await getIsBankDataExist();
    if (!!!isBankExist) {
      importDefaultBanksData();
    }
  }
  async function prepareTransactionCategoryData() {
    const isTransactionCategoryExist = await getIsTransactionCategoryDataExist();
    if (!!!isTransactionCategoryExist) {
      importDefaultTransactionCategory();
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar />
      <BlurScreen />
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <NavigationContainer theme={theme}>
            <BottomSheetModalProvider>
              <AppNavigators />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
