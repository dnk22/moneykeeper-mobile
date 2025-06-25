import { SharedStackParamsList } from './shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** Onboarding stack navigation */
export type OnboardingStackParamList = SharedStackParamsList & {
  [ROUTES.ONBOARDING_TAB]: undefined;
};

export type OnboardingStackNavigationProps = NativeStackScreenProps<
  OnboardingStackParamList,
  keyof OnboardingStackParamList
>['navigation'];

export type OnboardingStackRouteProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>['route'];
