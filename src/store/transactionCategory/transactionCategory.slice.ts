import { TTransactionsCategory } from 'database/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type transactionCategoryProps = {
  parentSelected?: TTransactionsCategory;
  isUpdateMode: boolean;
};

const initialState = {
  isUpdateMode: false,
} as transactionCategoryProps;

export const transactionCategorySlice = createSlice({
  name: 'transactionCategory',
  initialState: initialState,
  reducers: {
    setParentGroup(state, { payload }: PayloadAction<TTransactionsCategory>) {
      state.parentSelected = payload;
    },
    toggleUpdateMode(state, { payload }: PayloadAction<boolean>) {
      state.isUpdateMode = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setParentGroup, toggleUpdateMode } = transactionCategorySlice.actions;

export type TTransactionCategorySlice = {
  [transactionCategorySlice.name]: ReturnType<(typeof transactionCategorySlice)['reducer']>;
};

export default transactionCategorySlice.reducer;
