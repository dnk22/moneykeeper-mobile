import { CommonStackParamsList } from './common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

/** account stack navigation */
export type AccountStackParamList = CommonStackParamsList & {
  [ROUTES.ACCOUNT_TAB]: undefined;
};

export type AccountStackParamListProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;
