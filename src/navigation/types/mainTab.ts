import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AccountStackParamList } from './account';
import { TransactionParamList } from './transaction';
import {
  DASHBOARD,
  ACCOUNT,
  TRANSACTIONS,
  REPORT,
  SETTINGS,
} from 'utils/constants/navigation.constant';

export type MainTabStackParamsList = {
  [DASHBOARD]: undefined;
  [ACCOUNT]: NavigatorScreenParams<AccountStackParamList>;
  [TRANSACTIONS]: NavigatorScreenParams<TransactionParamList>;
  [REPORT]: undefined;
  [SETTINGS]: undefined;
};
export type BottomTabStackListProps<T extends keyof MainTabStackParamsList> = BottomTabScreenProps<
  MainTabStackParamsList,
  T
>;
