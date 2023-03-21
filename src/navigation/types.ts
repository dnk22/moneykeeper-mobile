import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
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
  EXPENSE_CATEGORY,
  INCOME_CATEGORY,
  LEND_BORROW,
} from './constants';

export type RootStackParamList = {
  [HOME]: NavigatorScreenParams<HomeStackParamList>;
  [BANK_NAVIGATION]: NavigatorScreenParams<BankParamList>;
  [ACCOUNT_PICKER]: { accountSelectedId?: string } | undefined;
  [TRANSACTION_CATEGORY]: NavigatorScreenParams<TransactionCategoryParamList>;
};

export type HomeStackParamList = {
  [DASHBOARD]: undefined;
  [ACCOUNT]: NavigatorScreenParams<AccountStackParamList>;
  [TRANSACTIONS]: NavigatorScreenParams<TransactionParamList>;
  [REPORT]: undefined;
  [SETTINGS]: undefined;
};

export type AccountStackParamList = {
  [ACCOUNTTAB]: undefined;
  [ADD_ACCOUNT]: { accountId: string } | undefined;
  [ACCOUNT_DETAIL]: { accountId: string; accountName: string };
  [CREATE_TRANSACTION_FROM_ACCOUNT]: NavigatorScreenParams<TransactionParamList>;
};

export type TransactionParamList = {
  [ADD_TRANSACTION]:
    | {
        transactionId?: string;
        categoryId?: string;
        accountId?: string;
        hideHeader?: boolean;
      }
    | undefined;
};

export type TransactionCategoryParamList = {
  [TRANSACTION_CATEGORY_LIST]: {
    tabActive: TRANSACTION_CATEGORY_TYPE;
  };
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

export type TransactionCategoryListParams = {
  [EXPENSE_CATEGORY]: undefined;
  [INCOME_CATEGORY]: undefined;
  [LEND_BORROW]: undefined;
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
export type AccountPickerProp = RouteProp<RootStackParamList, typeof ACCOUNT_PICKER>;
export type TransactionCategoryListProp = RouteProp<
  TransactionCategoryParamList,
  typeof TRANSACTION_CATEGORY_LIST
>;

// navigation type props
export type UpdateTransactionCategoryProps = NativeStackNavigationProp<
  TransactionCategoryParamList,
  typeof UPDATE_TRANSACTION_CATEGORY
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
