import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
//set default data

export type TTransactionsState = {
  lendBorrowId: {
    string?: string;
  };
};

const initialState: TTransactionsState = {
  lendBorrowId: {},
} as TTransactionsState;

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    updateLendBorrowId(state, { payload }: PayloadAction<TTransactionsState['lendBorrowId']>) {
      state.lendBorrowId = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLendBorrowId } = transactionsSlice.actions;

export type TTransactionsSlice = {
  [transactionsSlice.name]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
