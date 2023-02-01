import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  HOME,
  ADDWALLET,
  ACCOUNTTAB,
  DASHBOARD,
  ACCOUNT,
  REPORT,
  TRANSACTIONS,
  SETTINGS,
} from './constants';

export type RootStackParamList = {
  [HOME]: undefined;
};

export type HomeStackParamList = {
  [DASHBOARD]: undefined;
  [ACCOUNT]: undefined;
  [TRANSACTIONS]: undefined;
  [REPORT]: undefined;
  [SETTINGS]: undefined;
};

export type AccountStackParamList = {
  [ACCOUNTTAB]: undefined;
  [ADDWALLET]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, AccountStackParamList, HomeStackParamList {}
  }
}
