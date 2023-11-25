import { createSlice } from '@reduxjs/toolkit';
import { TAccount } from 'database/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountProps = {
  accountData: TAccount[];
};

//set default data
const initialState: AccountProps = {
  accountData: [],
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAllAccountData(state, { payload }: PayloadAction<TAccount[]>) {
      state.accountData = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
