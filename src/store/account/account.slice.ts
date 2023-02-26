import { createEntityAdapter, createSlice, nanoid, PayloadAction, Update } from '@reduxjs/toolkit';
import { TAccount, TAccountType, TBank } from 'database/types/index';
import { Account_Type, Bank } from 'utils/data';

export const accountAdapter = createEntityAdapter<TAccount>({});
export const accountTypeAdapter = createEntityAdapter<TAccountType>({});
export const bankAdapter = createEntityAdapter<TBank>({});

//set default data
const setInitAccountType = accountTypeAdapter.upsertMany(
  accountTypeAdapter.getInitialState(),
  Account_Type,
);
const setInitBankAdapter = bankAdapter.upsertMany(bankAdapter.getInitialState(), Bank);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: accountAdapter.getInitialState(),
    account_type: setInitAccountType,
    bank: setInitBankAdapter,
  },
  reducers: {
    addOrUpdateAccount: (state, { payload }: PayloadAction<TAccount>) => {
      const data = {
        ...payload,
        id: payload.id || nanoid(),
      };
      accountAdapter.upsertOne(state.account, data);
    },
    deleteAccountById(state, { payload }: PayloadAction<string>) {
      accountAdapter.removeOne(state.account, payload);
    },
    clearAllAccount: (state) => {
      accountAdapter.removeAll(state.account);
    },
    deactivateAccountById(
      state,
      action: PayloadAction<{ id: string; changes: Partial<TAccount> }>,
    ) {
      const { id, changes } = action.payload;
      const update: Update<TAccount> = { id, changes };
      accountAdapter.updateOne(state.account, update);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addOrUpdateAccount, clearAllAccount, deleteAccountById, deactivateAccountById } =
  accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
