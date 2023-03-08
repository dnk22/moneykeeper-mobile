import { createEntityAdapter, createSlice, nanoid, PayloadAction, Update } from '@reduxjs/toolkit';
import { TAccount, TAccountType, TBank } from 'database/types/index';
import { Account_Type, BankDefaultData } from 'utils/data';

export const accountAdapter = createEntityAdapter<TAccount>({});
export const accountTypeAdapter = createEntityAdapter<TAccountType>({});
export const bankAdapter = createEntityAdapter<TBank>({});

//set default data
const setInitAccountType = accountTypeAdapter.upsertMany(
  accountTypeAdapter.getInitialState(),
  Account_Type,
);
const setInitBankAdapter = bankAdapter.upsertMany(bankAdapter.getInitialState(), BankDefaultData);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accountType: setInitAccountType,
    bank: setInitBankAdapter,
  },
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
