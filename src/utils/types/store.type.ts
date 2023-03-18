import { TTransactionType } from 'database/types/index';
import { TTransactionsCategory } from 'database/types';

export type TTransactionsState = {
  transactionType: TTransactionType[];
  transactionTypeIdSelected: string;
  transactionCategorySelected?: TTransactionsCategory | null;
  transactionAccountSelected: { id: string; accountName: string; accountLogo: string } | null;
};
