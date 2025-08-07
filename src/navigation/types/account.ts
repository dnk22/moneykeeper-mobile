import { SharedStackParamsList } from './shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = {
  [ROUTES.ACCOUNT_TAB]?: undefined;
} | SharedStackParamsList;

export type AccountStackNavigationProps = NativeStackScreenProps<
  AccountStackParamList,
  keyof AccountStackParamList
>['navigation'];

export type AccountStackRouteProps<T extends keyof AccountStackParamList> = NativeStackScreenProps<
  AccountStackParamList,
  T
>['route'];
