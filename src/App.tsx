import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigators from 'navigation/index';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
// import RnKeyboard from 'rn-keyboard'; // <-- Import here
// import KeyboardCalculator from 'features/AddTransaction/common/InputCalculator/KeyboardCalculator';
// import { requestNotifications } from 'react-native-permissions';
// import { showToast } from 'utils/system';
// import AppInitService from 'services/firebase/appInit';
import { persistor, store } from './store';
import { FirebaseDataSource } from 'services/firebase/appInit';
import AppInitService from 'services/initialization';
import { AuthProvider } from 'services/auth/AuthProvider';

LogBox.ignoreAllLogs();

const App = () => {
  // useEffect(() => {
  //   RnKeyboard.registerKeyboard('KeyboardCalculator', KeyboardCalculator);
  // }, []);

  useEffect(() => {
    const initApp = async () => {
      const dataSource = new FirebaseDataSource();
      const appInit = AppInitService.getInstance(dataSource);
      await appInit.initializeApp();
    };
    initApp();
  }, []);

  // useEffect(() => {
  //   requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
  //     if (['blocked', 'denied'].includes(status)) {
  //       // openSettings().catch(() => showToast({ type: 'error', text2: 'Không thể mở cài đặt' }));
  //     }
  //   });
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AuthProvider>
            <AppNavigators />
          </AuthProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
