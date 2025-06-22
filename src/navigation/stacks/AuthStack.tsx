import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from 'features/Auth/SignIn';
import SignUpScreen from 'features/Auth/SignUp';
import ForgotPasswordScreen from 'features/Auth/ForgotPassword';
import { AuthStackParamList } from 'navigation/types/auth';
import { ROUTES } from 'navigation/constants/routes';
import { useCustomTheme } from 'resources/theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  const { colors } = useCustomTheme();
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SIGN_UP}
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name={ROUTES.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen
        options={{
          animation: 'default',
          headerShown: true,
          title: 'Quên mật khẩu',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: colors.primary },
        }}
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
