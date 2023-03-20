import { TTransactionsCategory } from 'database/types';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import {
  HOME,
  ADD_ACCOUNT,
  ACCOUNTTAB,
  DASHBOARD,
  ACCOUNT,
  REPORT,
  TRANSACTIONS,
  SETTINGS,
  ACCOUNT_DETAIL,
  ADD_TRANSACTION,
  ACCOUNT_PICKER,
  TRANSACTION_CATEGORY,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
  HOME_REPORT,
  BANK_NAVIGATION,
  BANK_HOME_LIST,
  CREATE_TRANSACTION_FROM_ACCOUNT,
  PARENT_LIST,
  ICON_SELECT,
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
  [ADD_ACCOUNT]: { accountId: string } | undefined;
  [ACCOUNT_DETAIL]: { accountId: string; accountName: string };
  [BANK_NAVIGATION]: { screen: keyof BankParamList; params: any };
  [CREATE_TRANSACTION_FROM_ACCOUNT]:
    | {
        screen: keyof TransactionParamList;
        params: TransactionParamList[keyof TransactionParamList];
      }
    | undefined;
};

export type TransactionParamList = {
  [ADD_TRANSACTION]:
    | {
        transactionId?: string;
        accountId?: string;
        hideHeader?: boolean;
      }
    | undefined;
  [ACCOUNT_PICKER]: { accountSelectedId?: string } | undefined;
  [TRANSACTION_CATEGORY]:
    | {
        screen: keyof TransactionCategoryParamList;
        params: TransactionCategoryParamList[keyof TransactionCategoryParamList];
      }
    | undefined;
};

export type TransactionCategoryParamList = {
  [TRANSACTION_CATEGORY_LIST]:
    | {
        tabActive?: TRANSACTION_CATEGORY_TYPE;
      }
    | undefined;
  [UPDATE_TRANSACTION_CATEGORY]:
    | {
        transactionCategoryId?: string;
        transactionCategoryTypeId?: TRANSACTION_CATEGORY_TYPE;
        parentId?: string;
      }
    | undefined;
  [PARENT_LIST]: undefined;
  [ICON_SELECT]: undefined;
};

export type ReportParamList = {
  [HOME_REPORT]: undefined;
};

export type BankParamList = {
  [BANK_HOME_LIST]: {
    isWallet: boolean;
  };
};

// route type props
export type AddAccountRouteProp = RouteProp<AccountStackParamList, typeof ADD_ACCOUNT>;
export type AddTransactionRouteProp = RouteProp<TransactionParamList, typeof ADD_TRANSACTION>;
export type BankRouteProp = RouteProp<BankParamList, typeof BANK_HOME_LIST>;
export type UpdateTransactionCategoryRouteProps = RouteProp<
  TransactionCategoryParamList,
  typeof UPDATE_TRANSACTION_CATEGORY
>;
export type AccountDetailProp = RouteProp<AccountStackParamList, typeof ACCOUNT_DETAIL>;
export type AccountPickerProp = RouteProp<TransactionParamList, typeof ACCOUNT_PICKER>;

// navigation type props
export type UpdateTransactionCategoryProps = NativeStackNavigationProp<
  TransactionCategoryParamList,
  typeof UPDATE_TRANSACTION_CATEGORY
>;

export type ExtendsParamList = RootStackParamList &
  HomeStackParamList &
  AccountStackParamList &
  TransactionParamList &
  TransactionCategoryParamList &
  BankParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ExtendsParamList {}
  }
}
