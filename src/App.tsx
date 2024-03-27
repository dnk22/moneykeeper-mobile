import React, { useEffect } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigators from 'navigation/index';
import { MyAppTheme } from 'resources/theme';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'components/index';
import RnKeyboard from 'rn-keyboard'; // <-- Import here
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { importBankDataLocal } from 'services/api/banks';
import { importTransactionCategoryDataLocal } from 'services/api/transactionsCategory';
import KeyboardCalculator from 'features/Transaction/AddTransaction/common/InputCalculator/KeyboardCalculator';
import BlurScreen from 'features/BlurScreen';
import Toast from 'react-native-toast-message';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { openSettings, requestNotifications } from 'react-native-permissions';
import { showToast } from 'utils/system';
import { persistor, store } from './store';

LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = MyAppTheme[isDarkMode ? 'dark' : 'default'];

  useEffect(() => {
    RnKeyboard.registerKeyboard('KeyboardCalculator', KeyboardCalculator);
  }, []);

  useEffect(() => {
    prepareInitData();
    requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
      if (['blocked', 'denied'].includes(status)) {
        // openSettings().catch(() => showToast({ type: 'error', text2: 'Không thể mở cài đặt' }));
      }
    });
  }, []);

  async function prepareInitData() {
    importBankDataLocal();
    importTransactionCategoryDataLocal();
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer theme={theme}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.primary }}
          edges={['top', 'right', 'left']}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar />
            <BlurScreen />
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <BottomSheetModalProvider>
                  <AppNavigators />
                </BottomSheetModalProvider>
              </PersistGate>
            </Provider>
            <Toast />
          </GestureHandlerRootView>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
