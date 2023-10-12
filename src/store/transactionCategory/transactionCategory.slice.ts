import { createSlice } from '@reduxjs/toolkit';

type transactionCategoryProps = {
  isUpdateMode: boolean;
};

const initialState = {
  isUpdateMode: false,
} as transactionCategoryProps;

export const transactionCategorySlice = createSlice({
  name: 'transactionCategory',
  initialState: initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = transactionCategorySlice.actions;

export type TTransactionCategorySlice = {
  [transactionCategorySlice.name]: ReturnType<(typeof transactionCategorySlice)['reducer']>;
};

export default transactionCategorySlice.reducer;
