import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { TAccountType, TBank } from 'database/types/index';
import { Account_Type } from 'utils/data';

type AccountProps = {
  accountType: EntityState<TAccountType>;
  bankIdSelected: string;
  isSelectMode: boolean;
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
  isSelectMode: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setBankSelected(state, { payload }: PayloadAction<string>) {
      state.bankIdSelected = payload;
    },
    setModeSelectTransaction(state, { payload }: { payload?: boolean }) {
      state.isSelectMode = payload || !state.isSelectMode;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBankSelected, setModeSelectTransaction } = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
