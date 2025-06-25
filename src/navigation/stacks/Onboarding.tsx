import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { OnboardingStackParamList } from 'navigation/types/onboarding';
import Onboarding from 'features/Onboard';

//set up routes
const AccountStack = createNativeStackNavigator<OnboardingStackParamList>();

function OnboardingNavigator() {
  return (
    <AccountStack.Navigator
      initialRouteName={ROUTES.ONBOARDING_TAB}
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        presentation: 'modal',
      }}
    >
      <AccountStack.Screen name={ROUTES.ONBOARDING_TAB} component={Onboarding} />
    </AccountStack.Navigator>
  );
}

export default OnboardingNavigator;
