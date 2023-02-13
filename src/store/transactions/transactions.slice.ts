import { createEntityAdapter, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TTransactions, TAccount, TTransactionsCategory } from 'types/models';

type TTransactionsState = {
  transactions: any;
  accountSelected?: TAccount | null;
  transactionCategorySelected?: TTransactionsCategory | null;
};

export const transactionAdapter = createEntityAdapter<TTransactions>({
  selectId: (transaction) => transaction._id,
});

//set default data
const initialState: TTransactionsState = {
  transactions: transactionAdapter.getInitialState(),
  accountSelected: null,
  transactionCategorySelected: null,
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addOrUpdateTransaction: (state, { payload }: PayloadAction<TTransactions>) => {
      const data = {
        ...payload,
        _id: payload._id || nanoid(),
      };
      transactionAdapter.upsertOne(state.transactions, data);
    },
    deleteTransactionById(state, { payload }: PayloadAction<string>) {
      transactionAdapter.removeOne(state.transactions, payload);
    },
    clearAllTransactions: (state) => {
      transactionAdapter.removeAll(state.transactions);
    },
    setAccountSelected(state, { payload }: PayloadAction<TAccount>) {
      state.accountSelected = { ...payload };
    },
    setTransactionCategorySelected(state, { payload }: PayloadAction<TTransactionsCategory>) {
      state.transactionCategorySelected = { ...payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrUpdateTransaction,
  deleteTransactionById,
  clearAllTransactions,
  setAccountSelected,
} = transactionsSlice.actions;

export type TTransactionsSlice = {
  [transactionsSlice.name]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
