import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionsSlice } from './transactions.slice';

const lendBorrowId = (state: RootState) => state[transactionsSlice.name].lendBorrowId;

// export custom selector
export const selectLendBorrowId = createSelector(
  lendBorrowId,
  (tAccountType) => tAccountType,
);
