import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type transactionCategoryProps = {
  lendBorrowData: Record<string, string>;
};

const initialState = {
  lendBorrowData: {},
} as transactionCategoryProps;

export const transactionCategorySlice = createSlice({
  name: 'transactionCategory',
  initialState: initialState,
  reducers: {
    setLendBorrowData(state, { payload }: PayloadAction<Record<string, string>>) {
      state.lendBorrowData = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLendBorrowData } = transactionCategorySlice.actions;

export type TTransactionCategorySlice = {
  [transactionCategorySlice.name]: ReturnType<(typeof transactionCategorySlice)['reducer']>;
};

export default transactionCategorySlice.reducer;
