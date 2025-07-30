import { SharedStackParamsList } from './shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = SharedStackParamsList & {
  [ROUTES.ACCOUNT_TAB]: undefined;
  [ROUTES.ADD_ACCOUNT]: {
    bankId?: string;
    accountId?: string;
    accountTypeId?: string;
  };
};

// export type AccountParamListProps<T extends keyof AccountStackParamList> = {
//   navigation: NativeStackScreenProps<AccountStackParamList, T>['navigation'];
//   route: NativeStackScreenProps<AccountStackParamList, T>['route'];
// };

export type AccountStackNavigationProps = NativeStackScreenProps<
  AccountStackParamList,
  keyof AccountStackParamList
>['navigation'];

export type AccountStackRouteProps<T extends keyof AccountStackParamList> = NativeStackScreenProps<
  AccountStackParamList,
  T
>['route'];
