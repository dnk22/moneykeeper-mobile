import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionsSlice } from './transactions.slice';

const transactionTypeState = (state: RootState) => state[transactionsSlice.name].transactionType;

const transactionTypeSelectedState = (state: RootState) =>
  state[transactionsSlice.name].transactionTypeIdSelected;

const transactionAccountSelectedState = (state: RootState) =>
  state[transactionsSlice.name].transactionAccountSelected;

const transactionCategorySelectedState = (state: RootState) =>
  state[transactionsSlice.name].transactionCategorySelected;

// export custom selector
export const selectTransactionType = createSelector(
  transactionTypeState,
  (tAccountType) => tAccountType,
);

export const selectTransactionTypeSelected = createSelector(
  transactionTypeSelectedState,
  (tAccountTypeSelected) => tAccountTypeSelected,
);

export const selectTransactionAccountSelected = createSelector(
  transactionAccountSelectedState,
  (tAccount) => tAccount,
);

export const selectTransactionCategorySelected = createSelector(
  transactionCategorySelectedState,
  (tCategory) => tCategory,
);
