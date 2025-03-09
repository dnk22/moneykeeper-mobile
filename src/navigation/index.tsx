import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BlurScreen from 'features/BlurScreen';
import Toast from 'react-native-toast-message';
import StatusBar from 'components/StatusBar';
import { useAppTheme } from 'resources/theme';
import { useAppSelector } from 'store/index';
import { selectAppTheme } from 'store/app/app.selector';
import { RootStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import MainBottomTabs from './tabs/MainBottomTabs';
import ModalStackScreen from './stacks/ModalStack';
import { navigationRef } from './helpers/navigate';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  const appThemeState = useAppSelector((state) => selectAppTheme(state));
  const theme = useAppTheme(appThemeState);

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <BlurScreen />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.primary }}
        edges={['top', 'right', 'left']}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar />
          <BottomSheetModalProvider>
            <RootStack.Navigator
              initialRouteName={ROUTES.MAIN}
              screenOptions={{
                headerShown: false,
                autoHideHomeIndicator: true,
              }}
            >
              <RootStack.Screen name={ROUTES.MAIN} component={MainBottomTabs} />
              <RootStack.Screen
                name={ROUTES.MODAL_STACK}
                component={ModalStackScreen}
                options={{
                  headerShown: false,
                  presentation: 'modal',
                }}
              />
            </RootStack.Navigator>
          </BottomSheetModalProvider>
          <Toast />
        </GestureHandlerRootView>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default AppNavigators;
