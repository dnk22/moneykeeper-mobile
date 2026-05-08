import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SharedStackParamsList } from './shared';
import { ROUTES } from 'navigation/constants/routes';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';

/** account stack navigation */
export type AccountStackParamList = {
  [ROUTES.ACCOUNT_TAB]?: {
    focusTab?: keyof typeof ACCOUNT_CATEGORY_ID;
  };
} & SharedStackParamsList;

export type AccountParamListProps<
  T extends keyof AccountStackParamList = keyof AccountStackParamList,
> = {
  navigation: NavigationProp<AccountStackParamList, keyof AccountStackParamList>;
  route: RouteProp<AccountStackParamList, T>;
};
