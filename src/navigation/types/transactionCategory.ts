import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TransactionCategoryParams = {
  [ROUTES.TRANSACTION_CATEGORY_TABS]: {
    tabsHide?: TRANSACTION_CATEGORY_TYPE;
    returnScreen: string;
  };
  [ROUTES.UPDATE_TRANSACTION_CATEGORY]: {
    icon?: string;
    transactionCategoryId?: string;
    parentId?: string;
    type?: TRANSACTION_CATEGORY_TYPE;
  };
  [ROUTES.PARENT_LIST]: { type: TRANSACTION_CATEGORY_TYPE };
  [ROUTES.ICON_SELECT]: undefined;
};

/** transaction category list stack navigation */
export type TransactionCategoryTabsParams = {
  [ROUTES.EXPENSE_CATEGORY]: {
    idActive?: string;
    returnScreen: string;
  };
  [ROUTES.INCOME_CATEGORY]: {
    idActive?: string;
    returnScreen: string;
  };
  [ROUTES.LEND_BORROW]: {
    idActive?: string;
    returnScreen: string;
  };
};

// route, navigation

export type TransactionCategoryParamProps<
  T extends keyof TransactionCategoryParams = keyof TransactionCategoryParams,
> = {
  navigation: NativeStackScreenProps<TransactionCategoryParams, T>['navigation'];
  route: RouteProp<TransactionCategoryParams, T>;
};

export type TransactionCategoryTabsParamsProps<
  T extends keyof TransactionCategoryTabsParams = keyof TransactionCategoryTabsParams,
> = {
  navigation: NativeStackScreenProps<TransactionCategoryTabsParams, T>['navigation'];
  route: RouteProp<TransactionCategoryTabsParams, T>;
};
