import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AuthStackParamList = {
  [ROUTES.SIGN_IN]: undefined;
  [ROUTES.SIGN_UP]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
};

export type AuthStackNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  keyof AuthStackParamList
>['navigation'];

export type AuthStackRouteProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>['route'];
