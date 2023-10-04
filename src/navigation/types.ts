import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  APPEARANCE,
} from './constants';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BANK_TYPE, TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';

/** root stack navigation */
export type RootStackParamList = {
  [HOME]: NavigatorScreenParams<HomeStackParamList>;
  [BANK_NAVIGATION]: NavigatorScreenParams<BankParams>;
  [ACCOUNT_PICKER]: { accountSelectedId?: string } | undefined;
  [TRANSACTION_CATEGORY]: NavigatorScreenParams<TransactionCategoryParams>;
  [APPEARANCE]: undefined;
};
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/** home stack navigation */
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

/** account stack navigation */
export type AccountStackParamList = {
  [ACCOUNTTAB]: undefined;
  [ADD_ACCOUNT]: { accountId?: string; bankId?: string; toAccountId?: string };
  [ACCOUNT_DETAIL]: { accountId: string; accountName: string };
  [CREATE_TRANSACTION_FROM_ACCOUNT]: {
    transactionId?: string;
    categoryId?: string;
    accountId?: string;
    toAccountId?: string;
  };
};
export type AccountStackParamListProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;

/** account stack navigation */
export type TransactionParamList = {
  [ADD_TRANSACTION]: {
    transactionId?: string;
    transactionType: TRANSACTION_TYPE;
    categoryId?: string;
    accountId?: string;
  };
};
export type TransactionParamListProps<T extends keyof TransactionParamList> =
  NativeStackScreenProps<TransactionParamList, T>;

/** transaction category stack navigation */
export type TransactionCategoryParams = {
  [TRANSACTION_CATEGORY_LIST]: { screen: any; returnScreen: any };
  [UPDATE_TRANSACTION_CATEGORY]: {
    icon?: string;
    transactionCategoryId?: string;
    transactionCategoryTypeId?: TRANSACTION_CATEGORY_TYPE;
    parentId?: string;
  };
  [PARENT_LIST]: { type: TRANSACTION_CATEGORY_TYPE };
  [ICON_SELECT]: undefined;
};
export type TransactionCategoryParamProps<T extends keyof TransactionCategoryParams> =
  NativeStackScreenProps<TransactionCategoryParams, T>;

/** transaction category list stack navigation */
export type TransactionCategoryListParams = {
  [EXPENSE_CATEGORY]: undefined;
  [INCOME_CATEGORY]: undefined;
  [LEND_BORROW]: undefined;
};
export type TransactionCategoryListParamsProps<T extends keyof TransactionCategoryListParams> =
  NativeStackScreenProps<TransactionCategoryListParams, T>;

/** report list stack navigation */
export type ReportParamList = {
  [HOME_REPORT]: undefined;
};
export type ReportParamListProps<T extends keyof ReportParamList> = NativeStackScreenProps<
  ReportParamList,
  T
>;

/** bank  stack navigation */
export type BankParams = {
  [BANK_HOME_LIST]: {
    type: BANK_TYPE;
  };
};
export type BankParamsProps<T extends keyof BankParams> = NativeStackScreenProps<BankParams, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
