import { TTransactionsCategory } from 'database/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

type transactionCategoryProps = {
  isTabSelected: TRANSACTION_CATEGORY_TYPE;
  parentSelected?: TTransactionsCategory;
};

const initialState = {
  isTabSelected: TRANSACTION_CATEGORY_TYPE.EXPENSE,
  navigation: null,
} as transactionCategoryProps;

export const transactionCategorySlice = createSlice({
  name: 'transactionCategory',
  initialState: initialState,
  reducers: {
    updateTabView(state, { payload }: PayloadAction<TRANSACTION_CATEGORY_TYPE>) {
      state.isTabSelected = payload;
    },
    setParentGroup(state, { payload }: PayloadAction<TTransactionsCategory>) {
      state.parentSelected = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTabView, setParentGroup } = transactionCategorySlice.actions;

export type TTransactionCategorySlice = {
  [transactionCategorySlice.name]: ReturnType<(typeof transactionCategorySlice)['reducer']>;
};

export default transactionCategorySlice.reducer;
