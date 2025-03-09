import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCustomTheme } from 'resources/theme';
import { SettingsParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import Settings from 'features/Settings';
import Appearance from 'features/Settings/Appearance';
import CommonStack from './CommonStack';
import SharedScreens from './SharedStacks';

//set up routes
const SettingsStack = createNativeStackNavigator<SettingsParamList>();

function SettingsNavigation() {
  const { colors } = useCustomTheme();

  return (
    <SettingsStack.Navigator
      initialRouteName={ROUTES.HOME_SETTINGS}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
      <SettingsStack.Screen
        name={ROUTES.HOME_SETTINGS}
        component={Settings}
        options={{
          title: 'Cài đặt',
          headerShown: false,
        }}
      />

      <SettingsStack.Screen
        name={ROUTES.APPEARANCE}
        component={Appearance}
        options={{
          title: 'Giao diện',
        }}
      />
      {SharedScreens({ stack: SettingsStack, screens: 'all' })}
    </SettingsStack.Navigator>
  );
}

export default SettingsNavigation;
