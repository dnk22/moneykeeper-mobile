import { RouteProp } from '@react-navigation/native';
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
  [ADDWALLET]: { accountId?: string };
};


// route type props
export type AddWalletRouteProp = RouteProp<AccountStackParamList, typeof ADDWALLET>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, AccountStackParamList, HomeStackParamList {}
  }
}
