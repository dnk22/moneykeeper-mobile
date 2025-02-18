import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type transactionCategoryProps = {
  lendBorrowData: Record<string, string>;
};

const initialState = {
  lendBorrowData: {},
} as transactionCategoryProps;

export const TRANSACTION_CATEGORY_SLICE_NAME = 'transactionCategoryStore';

export const transactionCategorySlice = createSlice({
  name: TRANSACTION_CATEGORY_SLICE_NAME,
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
  [TRANSACTION_CATEGORY_SLICE_NAME]: ReturnType<(typeof transactionCategorySlice)['reducer']>;
};

export default transactionCategorySlice.reducer;
