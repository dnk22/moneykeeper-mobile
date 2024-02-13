import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionsSlice } from './transactions.slice';

const transactionState = (state: RootState) => state[transactionsSlice.name];

// export custom selector
export const selectLendBorrowId = createSelector(
  transactionState,
  (state) => state.lendBorrowId,
);
export const selectRefreshTransactionHistory = createSelector(
  transactionState,
  (state) => state.refreshTransactionHistory,
);
