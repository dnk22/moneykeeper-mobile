import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TTransactionsCategory, TTransactionType } from 'database/types/index';
import { TRANSACTION_TYPE } from 'utils/constant';
import { TransactionTypeData } from 'utils/data';

//set default data

export type TTransactionsState = {
  transactionType: TTransactionType[];
  transactionTypeIdSelected: TRANSACTION_TYPE;
  transactionCategorySelected?: TTransactionsCategory | null;
  transactionAccountSelected: { id: string; accountName: string; accountLogo: string } | null;
};

const initialState: TTransactionsState = {
  transactionType: TransactionTypeData,
  transactionTypeIdSelected: TransactionTypeData[0].id,
  transactionCategorySelected: null,
  transactionAccountSelected: null,
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionTypeIdSelected(state, { payload }: PayloadAction<TRANSACTION_TYPE>) {
      state.transactionTypeIdSelected = payload;
    },
    setTransactionCategorySelected(state, { payload }: PayloadAction<TTransactionsCategory>) {
      state.transactionCategorySelected = payload;
    },
    setTransactionAccountSelected(
      state,
      { payload }: PayloadAction<{ id: string; accountName: string; accountLogo: string }>,
    ) {
      state.transactionAccountSelected = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTransactionTypeIdSelected,
  setTransactionAccountSelected,
  setTransactionCategorySelected,
} = transactionsSlice.actions;

export type TTransactionsSlice = {
  [transactionsSlice.name]: ReturnType<(typeof transactionsSlice)['reducer']>;
};

export default transactionsSlice.reducer;
