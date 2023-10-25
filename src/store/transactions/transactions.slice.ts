import { createSlice } from '@reduxjs/toolkit';

//set default data

export type TTransactionsState = {};

const initialState: TTransactionsState = {};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = transactionsSlice.actions;

export type TTransactionsSlice = {
  [transactionsSlice.name]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
