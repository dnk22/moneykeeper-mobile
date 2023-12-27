import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionCategorySlice } from './transactionCategory.slice';

const transactionCategoryState = (state: RootState) => state[transactionCategorySlice.name];

// export custom selector
export const selectLendBorrowData = createSelector(
  transactionCategoryState,
  (data) => data.lendBorrowData,
);
