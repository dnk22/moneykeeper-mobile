import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionsSlice } from './transactions.slice';

const transactionsState = (state: RootState) => state[transactionsSlice.name].transactions;
const accountSelectedState = (state: RootState) => state[transactionsSlice.name].accountSelected;
const transactionCategorySelectedState = (state: RootState) =>
  state[transactionsSlice.name].transactionCategorySelected;

// export custom selector
export const selectAllTransactions = createSelector(
  transactionsState,
  (transactions) => transactions,
);

export const selectAccountSelected = createSelector(accountSelectedState, (account) => account);

export const selectTransactionCategorySelected = createSelector(
  transactionCategorySelectedState,
  (transactionCategory) => transactionCategory,
);
