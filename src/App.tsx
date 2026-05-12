import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigators from 'navigation/index';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AuthProvider } from 'services/auth/AuthProvider';
import { persistor, store } from './store';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { CustomKeyboardProvider } from 'libs/custom-keyboard/CustomKeyboardProvider';

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AuthProvider>
            <KeyboardProvider>
              <CustomKeyboardProvider>
                <AppNavigators />
              </CustomKeyboardProvider>
            </KeyboardProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
