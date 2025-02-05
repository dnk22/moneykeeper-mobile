import { TTransactions } from 'database/types';
import { WidgetOrderListProps } from 'features/Dashboard/constants';
import {
  FLAT,
  SORT_ACCOUNT_BY_KEY,
  STICKY,
  TRANSACTION_CATEGORY_TYPE,
  VIEW_CATEGORY_FAST_BY_COLUMN,
} from 'utils/constants';

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

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

export type DebtLoanTypes = {
  id: string;
  relatedPerson: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  categoryName: string;
  categoryId: string;
  value: number;
};
