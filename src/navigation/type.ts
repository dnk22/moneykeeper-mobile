import { RouteProp } from '@react-navigation/native';
import {
  HOME,
  ADDWALLET,
  ACCOUNTTAB,
  DASHBOARD,
  ACCOUNT,
  REPORT,
  TRANSACTIONS,
  SETTINGS,
  WALLET_DETAIL,
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
  [WALLET_DETAIL]: { accountId: string };
};

// route type props
export type AddWalletRouteProp = RouteProp<AccountStackParamList, typeof ADDWALLET>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, AccountStackParamList, HomeStackParamList {}
  }
}
