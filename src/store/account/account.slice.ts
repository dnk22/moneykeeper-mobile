import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAccount, TAccountType } from 'src/types/models';
import { Account_Type } from 'utils/constant';

export const accountAdapter = createEntityAdapter<TAccount>();
export const accountTypeAdapter = createEntityAdapter<TAccountType>({
  selectId: (accountType) => accountType._id,
});

const setInitAccountType = accountTypeAdapter.upsertMany(
  accountTypeAdapter.getInitialState(),
  Account_Type,
);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: accountAdapter.getInitialState(),
    account_type: setInitAccountType,
  },
  reducers: {
    addOrUpdateAccount: (state, { payload }: PayloadAction<TAccount>) => {
      accountAdapter.upsertOne(state.account, {});
    },
    deleteAccountById(state, { payload }: PayloadAction<string>) {
      accountAdapter.removeOne(state.account, payload);
    },
    clearAllAccount: (state) => {
      accountAdapter.removeAll(state.account);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addOrUpdateAccount, clearAllAccount, deleteAccountById } = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
