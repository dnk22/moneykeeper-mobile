import { useEffect } from 'react';
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
import AppContainer from './components/AppContainer';
import { useAuth } from 'services/auth/AuthProvider';
import { FirebaseDataSource } from 'services/firebase/appInit';
import AppInitService from 'services/initialization';
//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  const { auto, darkMode, color } = useAppSelector((state) => selectAppearanceConfig(state));
  const theme = useAppTheme({ auto, darkMode, color });
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const initApp = async () => {
      const dataSource = new FirebaseDataSource();
      const appInit = AppInitService.getInstance(dataSource);
      await appInit.initializeApp();
    };
    initApp();
  }, []);

  return (
    <NavigationContainer theme={theme} ref={navigation.navigationRef}>
      <BlurScreen />
      <AppLoading theme={theme} />
      <AppContainer theme={theme}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            autoHideHomeIndicator: true,
          }}
        >
          {isLoggedIn ? (
            <RootStack.Screen name={ROUTES.MAIN} component={MainBottomTabs} />
          ) : (
            <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </AppContainer>
    </NavigationContainer>
  );
}

export default AppNavigators;
