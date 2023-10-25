import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionsSlice } from './transactions.slice';

const transactionTypeState = (state: RootState) => state[transactionsSlice.name];

// export custom selector
export const selectTransactionType = createSelector(
  transactionTypeState,
  (tAccountType) => tAccountType,
);
