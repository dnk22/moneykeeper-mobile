import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import {
  EXPENSE_CATEGORY,
  ICON_SELECT,
  INCOME_CATEGORY,
  LEND_BORROW,
  PARENT_LIST,
  TRANSACTION_CATEGORY_LIST,
  UPDATE_TRANSACTION_CATEGORY,
} from 'utils/constants/navigation.constant';

export type TransactionCategoryParams = {
  [TRANSACTION_CATEGORY_LIST]: { tabHide: string };
  [UPDATE_TRANSACTION_CATEGORY]: {
    icon?: string;
    transactionCategoryId?: string;
    transactionCategoryTypeId?: TRANSACTION_CATEGORY_TYPE;
    parentId?: string;
    type?: any;
  };
  [PARENT_LIST]: { type: TRANSACTION_CATEGORY_TYPE };
  [ICON_SELECT]: undefined;
};

export type TransactionCategoryParamProps<T extends keyof TransactionCategoryParams> =
  NativeStackScreenProps<TransactionCategoryParams, T>;

/** transaction category list stack navigation */
export type TransactionCategoryListParams = {
  [EXPENSE_CATEGORY]: { idActive?: string; returnScreen: any; tabHide?: any };
  [INCOME_CATEGORY]: { idActive?: string; returnScreen: any; tabHide?: any };
  [LEND_BORROW]: { idActive?: string; returnScreen: any; tabHide?: any };
};
export type TransactionCategoryListParamsProps<T extends keyof TransactionCategoryListParams> =
  MaterialTopTabScreenProps<TransactionCategoryListParams, T>;
