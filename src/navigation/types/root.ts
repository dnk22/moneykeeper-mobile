import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import { MainTabStackParamsList } from './mainTab';
import { OnboardingStackParamList } from './onboarding';

export type RootStackParamList = {
  [ROUTES.AUTH]: undefined;
  [ROUTES.MAIN]: NavigatorScreenParams<MainTabStackParamsList>;
  [ROUTES.ONBOARDING]: NavigatorScreenParams<OnboardingStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
