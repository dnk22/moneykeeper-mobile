import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountProps = {
  accountStatementList: Record<string, Record<string, number>>;
};

//set default data
const initialState: AccountProps = {
  accountStatementList: {},
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateAccountStatement(
      state,
      { payload }: PayloadAction<AccountProps['accountStatementList']>,
    ) {
      state.accountStatementList = {
        ...state.accountStatementList,
        ...payload,
      };
      return state;
    },
    removeAccountStatement(state, { payload }: PayloadAction<string>) {
      const data = state.accountStatementList;
      delete data[payload];
      state.accountStatementList = {
        ...data,
      };
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountStatement, removeAccountStatement } = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
