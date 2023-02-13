import { ADD_TRANSACTION, ACCOUNT_PICKER } from 'navigation/constants';
import { RouteProp } from '@react-navigation/native';
import {
  HOME,
  ADDACCOUNT,
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
  [ADDACCOUNT]: { accountId?: string };
  [WALLET_DETAIL]: { accountId: string };
};

export type TransactionParamList = {
  [ADD_TRANSACTION]: {
    transaction_id?: string;
  };
  [ACCOUNT_PICKER]: {
    isAccountIdSelected: string;
  };
};

// route type props
export type AddWalletRouteProp = RouteProp<AccountStackParamList, typeof ADDACCOUNT>;

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends RootStackParamList,
        AccountStackParamList,
        HomeStackParamList,
        TransactionParamList {}
  }
}
