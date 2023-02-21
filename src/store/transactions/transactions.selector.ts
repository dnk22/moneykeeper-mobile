import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionCategoryAdapter, transactionsSlice } from './transactions.slice';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

const transactionsState = (state: RootState) => state[transactionsSlice.name].transactions;
const transactionsCategoryState = (state: RootState) =>
  state[transactionsSlice.name].transactionCategory;
const accountSelectedState = (state: RootState) => state[transactionsSlice.name].accountSelected;
const transactionCategorySelectedState = (state: RootState) =>
  state[transactionsSlice.name].transactionCategorySelected;

// adapterSelector
export const transactionsCategorySelectors =
  transactionCategoryAdapter.getSelectors(transactionsCategoryState);

// export custom selector
export const selectAllTransactions = createSelector(
  transactionsState,
  (transactions) => transactions,
);

export const selectExpenseTransactionCategory = createSelector(
  [transactionsCategorySelectors.selectAll],
  (category) =>
    category.filter((category) => category.category_type === TRANSACTION_CATEGORY_TYPE.EXPENSE),
);

export const selectIncomeTransactionCategory = createSelector(
  [transactionsCategorySelectors.selectAll],
  (category) =>
    category.filter((category) => category.category_type === TRANSACTION_CATEGORY_TYPE.INCOME),
);

export const selectAccountSelected = createSelector(accountSelectedState, (account) => account);

export const selectTransactionCategorySelected = createSelector(
  transactionCategorySelectedState,
  (transactionCategory) => transactionCategory,
);
