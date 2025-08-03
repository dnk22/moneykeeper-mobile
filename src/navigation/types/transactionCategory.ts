import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import { NavigatorScreenParams } from '@react-navigation/native';

export type TransactionCategoryParams = {
  [ROUTES.TRANSACTION_CATEGORY_LIST]: NavigatorScreenParams<TransactionCategoryTabsParams>;
  [ROUTES.UPDATE_TRANSACTION_CATEGORY]: {
    icon?: string;
    transactionCategoryId?: string;
    transactionCategoryTypeId?: TRANSACTION_CATEGORY_TYPE;
    parentId?: string;
    type?: TRANSACTION_CATEGORY_TYPE;
  } | undefined;
  [ROUTES.PARENT_LIST]: { type: TRANSACTION_CATEGORY_TYPE };
  [ROUTES.ICON_SELECT]: undefined;
};

/** transaction category list stack navigation */
export type TransactionCategoryTabsParams = {
  [ROUTES.EXPENSE_CATEGORY]: {
    idActive?: string;
    returnScreen: string;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
  [ROUTES.INCOME_CATEGORY]: {
    idActive?: string;
    returnScreen: string;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
  [ROUTES.LEND_BORROW]: {
    idActive?: string;
    returnScreen: string;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
};

// route, navigation
export type TransactionCategoryParamProps<T extends keyof TransactionCategoryParams> = NativeStackScreenProps<TransactionCategoryParams, T>;
export type TransactionCategoryTabsParamsProps<T extends keyof TransactionCategoryTabsParams> = {
  navigation: NativeStackScreenProps<TransactionCategoryTabsParams, T>['navigation'];
  route: NativeStackScreenProps<TransactionCategoryTabsParams, T>['route'];
};
