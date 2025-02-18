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

export type BottomTabStackList = {
  [DASHBOARD]: undefined;
  [ACCOUNT]: NavigatorScreenParams<AccountStackParamList>;
  [TRANSACTIONS]: NavigatorScreenParams<TransactionParamList>;
  [REPORT]: undefined;
  [SETTINGS]: undefined;
};
export type BottomTabStackListProps<T extends keyof BottomTabStackList> = BottomTabScreenProps<
  BottomTabStackList,
  T
>;
