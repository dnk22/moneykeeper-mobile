import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WidgetSettings from 'features/Dashboard/WidgetSettings';
import BlurScreen from 'features/BlurScreen';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StatusBar from 'components/StatusBar';
import { useAppTheme } from 'resources/theme';
import { useAppSelector } from 'store/index';
import { selectAppTheme } from 'store/app/app.selector';
import {
  BANK_NAVIGATION,
  HOME,
  TRANSACTION_CATEGORY,
  WIDGET_SETTINGS,
} from 'utils/constants/navigation.constant';
import TransactionCategoryNavigation from './TransactionCategory';
import HomeNavigation from './Home';
import BankNavigation from './Bank';
import { RootStackParamList } from './types';

//set up routes
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppNavigators() {
  const { darkMode, color } = useAppSelector((state) => selectAppTheme(state));
  const theme = useAppTheme({ darkMode, color });

  return (
    <>
      <NavigationContainer theme={theme}>
        <BlurScreen />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.primary }}
          edges={['top', 'right', 'left']}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar />
            <BottomSheetModalProvider>
              <RootStack.Navigator
                initialRouteName={HOME}
                screenOptions={{
                  headerShown: false,
                  autoHideHomeIndicator: true,
                }}
              >
                <RootStack.Screen name={HOME} component={HomeNavigation} />
                <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                  <RootStack.Screen name={BANK_NAVIGATION} component={BankNavigation} />
                  <RootStack.Screen
                    name={TRANSACTION_CATEGORY}
                    component={TransactionCategoryNavigation}
                  />
                </RootStack.Group>
                <RootStack.Group screenOptions={{ headerShown: true }}>
                  <RootStack.Screen
                    name={WIDGET_SETTINGS}
                    component={WidgetSettings}
                    options={{
                      title: 'Chỉnh sửa DS Widget',
                      presentation: 'containedModal',
                    }}
                  />
                </RootStack.Group>
              </RootStack.Navigator>
            </BottomSheetModalProvider>
            <Toast />
          </GestureHandlerRootView>
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
}

export default AppNavigators;
