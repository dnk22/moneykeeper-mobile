import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ROUTES } from 'navigation/constants/routes';
import { AccountStackParamList } from './account';
import { TransactionParamList } from './transaction';

export type MainTabStackParamsList = {
  [ROUTES.DASHBOARD]: undefined;
  [ROUTES.ACCOUNT]: NavigatorScreenParams<AccountStackParamList>;
  [ROUTES.TRANSACTIONS]: NavigatorScreenParams<TransactionParamList>;
  [ROUTES.REPORT]: undefined;
  [ROUTES.SETTINGS]: undefined;
};
export type BottomTabStackListProps<T extends keyof MainTabStackParamsList> = BottomTabScreenProps<
  MainTabStackParamsList,
  T
>;
