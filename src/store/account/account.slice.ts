import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { TAccountType, TBank } from 'database/types/index';
import { Account_Type } from 'utils/data';

type AccountProps = {
  accountType: EntityState<TAccountType>;
  bankIdSelected: string;
};

export const accountTypeAdapter = createEntityAdapter<TAccountType>({});

//set default data
const setInitAccountType = accountTypeAdapter.upsertMany(
  accountTypeAdapter.getInitialState(),
  Account_Type,
);

const initialState: AccountProps = {
  accountType: setInitAccountType,
  bankIdSelected: '',
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setBankSelected(state, { payload }: PayloadAction<string>) {
      state.bankIdSelected = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBankSelected } = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
