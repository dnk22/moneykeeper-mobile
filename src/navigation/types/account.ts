import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SharedStackParamsList } from './shared';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = {
  [ROUTES.ACCOUNT_TAB]?: undefined;
} & SharedStackParamsList;

export type AccountParamListProps<
  T extends keyof AccountStackParamList = keyof AccountStackParamList,
> = {
  navigation: NavigationProp<AccountStackParamList, keyof AccountStackParamList>;
  route: RouteProp<AccountStackParamList, T>;
};
