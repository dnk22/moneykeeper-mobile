import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAccount, TAccountType, TProvider, TBank } from 'src/types/models';
import { Account_Type, Provider, Bank } from 'utils/constant';

export const accountAdapter = createEntityAdapter<TAccount>({
  selectId: (account) => account._id,
});
export const accountTypeAdapter = createEntityAdapter<TAccountType>({
  selectId: (accountType) => accountType._id,
});
export const providerAdapter = createEntityAdapter<TProvider>({
  selectId: (provider) => provider._id,
});
export const bankAdapter = createEntityAdapter<TBank>({
  selectId: (bank) => bank._id,
});

//set default data
const setInitAccountType = accountTypeAdapter.upsertMany(
  accountTypeAdapter.getInitialState(),
  Account_Type,
);
const setInitProvider = providerAdapter.upsertMany(providerAdapter.getInitialState(), Provider);
const setInitBankAdapter = bankAdapter.upsertMany(bankAdapter.getInitialState(), Bank);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: accountAdapter.getInitialState(),
    account_type: setInitAccountType,
    provider: setInitProvider,
    bank: setInitBankAdapter,
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
