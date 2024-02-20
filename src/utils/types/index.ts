import { TTransactions } from 'database/types';
import { WidgetOrderListProps } from 'features/Dashboard/constants';
import {
  BANK_TYPE,
  FLAT,
  SORT_ACCOUNT_BY_KEY,
  STICKY,
  TRANSACTION_TYPE,
  VIEW_CATEGORY_FAST_BY_COLUMN,
} from 'utils/constant';

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TResponse = {
  success: boolean;
  message?: unknown;
  data?: unknown;
};
export type TSearchBankParams = {
  type: BANK_TYPE;
  text?: string;
};

export type TTransactionType = {
  id: string;
  value: TRANSACTION_TYPE;
  name: string;
  icon: string;
  categoryType?: string;
};

export type AccountViewSettingsProps = {
  sort: keyof typeof SORT_ACCOUNT_BY_KEY;
  group: boolean;
  isViewActive: boolean;
};

export type AppStateProps = {
  accountViewSettings: AccountViewSettingsProps;
  isReportViewByGrid: boolean;
  transactionListDisplayConfig: Record<string, boolean>;
  homeBottomBarType: typeof FLAT | typeof STICKY;
  viewCategoryMostAndRecent: keyof typeof VIEW_CATEGORY_FAST_BY_COLUMN;
  widgetOrder: WidgetOrderListProps[];
};

export type GroupedTransactionProps = {
  date: string;
  data: TTransactions[];
};

export type StatementViewProps = {
  month?: Date;
  startDate?: Date;
  endDate?: Date;
};
