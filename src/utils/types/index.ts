import { TTransactions } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

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
