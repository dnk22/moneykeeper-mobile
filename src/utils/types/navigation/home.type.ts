import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AccountStackParamList } from './account.type';
import { TransactionParamList } from './transaction.type';
import {
  DASHBOARD,
  ACCOUNT,
  TRANSACTIONS,
  REPORT,
  SETTINGS,
} from 'utils/constants/navigation.constant';

export type HomeStackParamList = {
  [DASHBOARD]: undefined;
  [ACCOUNT]: NavigatorScreenParams<AccountStackParamList>;
  [TRANSACTIONS]: NavigatorScreenParams<TransactionParamList>;
  [REPORT]: undefined;
  [SETTINGS]: undefined;
};
export type HomeStackParamListProps<T extends keyof HomeStackParamList> = BottomTabScreenProps<
  HomeStackParamList,
  T
>;
