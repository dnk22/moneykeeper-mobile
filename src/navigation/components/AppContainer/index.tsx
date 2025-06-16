import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import StatusBar from 'components/StatusBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomTheme } from 'resources/theme';
import Toast from 'react-native-toast-message';

function AppContainer({ theme, children }: { theme: CustomTheme; children: React.ReactNode }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.primary }}
      edges={['top', 'right', 'left']}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar />
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        <Toast />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
export default AppContainer;
