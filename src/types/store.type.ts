import { EntityState } from '@reduxjs/toolkit';
import { TAccount, TTransactions, TTransactionsCategory } from './models';

export type TTransactionsState = {
  transactions: EntityState<TTransactions>;
  transactionCategory: EntityState<TTransactionsCategory>;
  accountSelected: TAccount | null;
  transactionCategorySelected?: TTransactionsCategory | null;
};
