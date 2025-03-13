import { SharedStackParamsList } from './shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = SharedStackParamsList & {
  [ROUTES.ACCOUNT_TAB]: undefined;
};

export type AccountStackParamListProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;
