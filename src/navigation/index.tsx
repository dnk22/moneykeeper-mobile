import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BlurScreen from 'features/common/BlurScreen';
import AppLoading from 'features/common/AppLoading';
import { useAppTheme } from 'resources/theme';
import { useAppSelector } from 'store/index';
import { selectAppearanceConfig } from 'store/app/app.selector';
import { RootStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import navigation from 'navigation/helpers/navigate';
import MainBottomTabs from './tabs/MainBottomTabs';
import AuthNavigator from './stacks/AuthStack';
import { useAuth } from 'services/auth/AuthProvider';
import OnboardingNavigator from './stacks/Onboarding';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { CustomKeyboardPortal } from 'libs/custom-keyboard/CustomKeyboardPortal';
import { PortalProvider } from '@gorhom/portal';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  const { auto, darkMode, color } = useAppSelector((state) => selectAppearanceConfig(state));
  const theme = useAppTheme({ auto, darkMode, color });
  const { isLoggedIn, isOnboarded } = useAuth();

  return (
    <NavigationContainer theme={theme} ref={navigation.navigationRef}>
      <PortalProvider>
        <BlurScreen />
        <AppLoading theme={theme} darkMode={darkMode} />
        <SafeAreaView style={{ flex: 1 }} edges={['right', 'left']}>
          <GestureHandlerRootView>
            <RootStack.Navigator
              screenOptions={{
                headerShown: false,
                autoHideHomeIndicator: true,
              }}
            >
              {!isLoggedIn ? (
                <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
              ) : !isOnboarded ? (
                <RootStack.Screen name={ROUTES.ONBOARDING} component={OnboardingNavigator} />
              ) : (
                <RootStack.Screen name={ROUTES.MAIN} component={MainBottomTabs} />
              )}
            </RootStack.Navigator>
            <Toast />
            <CustomKeyboardPortal />
          </GestureHandlerRootView>
        </SafeAreaView>
      </PortalProvider>
    </NavigationContainer>
  );
}

export default AppNavigators;
