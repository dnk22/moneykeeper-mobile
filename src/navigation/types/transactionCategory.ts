import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import { RootStackParamList } from './root';
import { MainTabStackParamsList } from './mainTab';

export type TransactionCategoryParams = {
  [ROUTES.TRANSACTION_CATEGORY_LIST]: { tabHide: string };
  [ROUTES.UPDATE_TRANSACTION_CATEGORY]: {
    icon?: string;
    transactionCategoryId?: string;
    transactionCategoryTypeId?: TRANSACTION_CATEGORY_TYPE;
    parentId?: string;
    type?: any;
  };
  [ROUTES.PARENT_LIST]: { type: TRANSACTION_CATEGORY_TYPE };
  [ROUTES.ICON_SELECT]: undefined;
};

export type TransactionCategoryParamProps<T extends keyof TransactionCategoryParams> =
  NativeStackScreenProps<TransactionCategoryParams, T>;

/** transaction category list stack navigation */
export type TransactionCategoryListParams = {
  [ROUTES.EXPENSE_CATEGORY]: {
    idActive?: string;
    returnScreen: keyof RootStackParamList | keyof MainTabStackParamsList;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
  [ROUTES.INCOME_CATEGORY]: {
    idActive?: string;
    returnScreen: keyof RootStackParamList | keyof MainTabStackParamsList;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
  [ROUTES.LEND_BORROW]: {
    idActive?: string;
    returnScreen: keyof RootStackParamList | keyof MainTabStackParamsList;
    tabHide?: TRANSACTION_CATEGORY_TYPE[];
  };
};
export type TransactionCategoryListParamsProps<T extends keyof TransactionCategoryListParams> =
  MaterialTopTabScreenProps<TransactionCategoryListParams, T>;
