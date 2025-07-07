import React, { useMemo } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import StatusBar from 'components/StatusBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomTheme } from 'resources/theme';
import Toast from 'react-native-toast-message';

function AppContainer({
  theme,
  isMarginTop,
  children,
}: {
  theme: CustomTheme;
  isMarginTop: boolean | undefined;
  children: React.ReactNode;
}) {

  const edges: ('top' | 'right' | 'left' | 'bottom')[] = useMemo(
    () => (isMarginTop ? ['top', 'right', 'left'] : ['right', 'left']),
    [isMarginTop],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primary }} edges={edges}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar />
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        <Toast />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
export default AppContainer;
