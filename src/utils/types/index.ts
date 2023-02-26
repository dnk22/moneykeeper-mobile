export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

import { EntityState } from '@reduxjs/toolkit';
import { TAccount, TTransactions, TTransactionsCategory } from 'database/models/index';

export type TTransactionsState = {
  transactions: EntityState<TTransactions>;
  transactionCategory: EntityState<TTransactionsCategory>;
  accountSelected: TAccount | null;
  transactionCategorySelected?: TTransactionsCategory | null;
};
