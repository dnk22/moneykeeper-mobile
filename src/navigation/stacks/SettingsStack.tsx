import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { APPEARANCE, HOME_SETTINGS } from 'utils/constants/navigation.constant';

// import route component
import { useCustomTheme } from 'resources/theme';
import { SettingsParamList } from 'utils/types/navigation';
import Settings from 'features/Settings';
import Appearance from 'features/Settings/Appearance';
import CommonStack from './CommonStack';

//set up routes
const SettingsStack = createNativeStackNavigator<SettingsParamList>();

function SettingsNavigation() {
  const { colors } = useCustomTheme();

  return (
    <SettingsStack.Navigator
      initialRouteName={HOME_SETTINGS}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
      <SettingsStack.Screen
        name={HOME_SETTINGS}
        component={Settings}
        options={{
          title: 'Cài đặt',
          headerShown: false,
        }}
      />

      <SettingsStack.Screen
        name={APPEARANCE}
        component={Appearance}
        options={{
          title: 'Giao diện',
        }}
      />
      <SettingsStack.Group>
        {CommonStack({ Stack: SettingsStack, parentName: 'home_settings' })}
      </SettingsStack.Group>
    </SettingsStack.Navigator>
  );
}

export default SettingsNavigation;
