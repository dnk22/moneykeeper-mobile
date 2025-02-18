import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
//set default data

export type TTransactionsState = {
  lendBorrowId: {
    string?: string;
  };
  refreshTransactionHistory: number;
};

const initialState: TTransactionsState = {
  lendBorrowId: {},
  refreshTransactionHistory: 0,
} as TTransactionsState;

export const TRANSACTION_SLICE_NAME = 'transactionStore';

export const transactionsSlice = createSlice({
  name: TRANSACTION_SLICE_NAME,
  initialState,
  reducers: {
    updateLendBorrowId(state, { payload }: PayloadAction<TTransactionsState['lendBorrowId']>) {
      state.lendBorrowId = payload;
    },
    refreshTransactionHistory(state) {
      state.refreshTransactionHistory = state.refreshTransactionHistory + 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLendBorrowId, refreshTransactionHistory } = transactionsSlice.actions;

export type TTransactionsSlice = {
  [TRANSACTION_SLICE_NAME]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
