import { createEntityAdapter, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TTransactions, TAccount, TTransactionsCategory } from 'database/types/index';
import { TTransactionsState } from 'utils/types';

export const transactionAdapter = createEntityAdapter<TTransactions>({
  selectId: (transaction) => transaction._id,
});
export const transactionCategoryAdapter = createEntityAdapter<TTransactionsCategory>({
  selectId: (tCategory) => tCategory._id,
});

//set default data
const initialState: TTransactionsState = {
  transactions: transactionAdapter.getInitialState(),
  transactionCategory: transactionCategoryAdapter.getInitialState(),
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
    addOrUpdateTransactionCategory: (state, { payload }: PayloadAction<TTransactionsCategory>) => {
      const data = {
        ...payload,
        _id: payload._id || nanoid(),
      };
      transactionCategoryAdapter.upsertOne(state.transactionCategory, data);
    },
    deleteTransactionById(state, { payload }: PayloadAction<string>) {
      transactionAdapter.removeOne(state.transactions, payload);
    },
    deleteTransactionCategoryById(state, { payload }: PayloadAction<string>) {
      transactionCategoryAdapter.removeOne(state.transactionCategory, payload);
    },
    clearAllTransactions: (state) => {
      transactionAdapter.removeAll(state.transactions);
    },
    setAccountSelected(state, { payload }: PayloadAction<TAccount | string>) {
      if (typeof payload === 'string') {
      } else {
        state.accountSelected = payload;
      }
    },
    setTransactionCategorySelected(state, { payload }: PayloadAction<TTransactionsCategory>) {
      state.transactionCategorySelected = { ...payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrUpdateTransaction,
  addOrUpdateTransactionCategory,
  deleteTransactionById,
  deleteTransactionCategoryById,
  clearAllTransactions,
  setAccountSelected,
} = transactionsSlice.actions;

export type TTransactionsSlice = {
  [transactionsSlice.name]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
