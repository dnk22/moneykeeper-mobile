import { TTransactionType } from 'database/types/index';
import { TAccount, TTransactionsCategory } from 'database/types';

export type TTransactionsState = {
  transactionType: TTransactionType[];
  transactionTypeIdSelected: string;
  transactionCategorySelected?: TTransactionsCategory | null;
  transactionAccountSelected: Partial<TAccount> | null;
};
