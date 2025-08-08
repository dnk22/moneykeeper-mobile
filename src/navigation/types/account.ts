import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SharedStackParamsList } from './shared';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = {
  [ROUTES.ACCOUNT_TAB]?: undefined;
} & SharedStackParamsList;

export type AccountStackNavigationProps = NavigationProp<
  AccountStackParamList,
  keyof AccountStackParamList
>;

export type AccountStackRouteProps<T extends keyof AccountStackParamList> = RouteProp<
  AccountStackParamList,
  T
>;
