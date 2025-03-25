import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountProps = {
  accountStatementInfo: Record<string, Record<string, any>>;
};

//set default data
const initialState: AccountProps = {
  accountStatementInfo: {},
};
export const ACCOUNT_SLICE_NAME = 'accountStore';

export const accountSlice = createSlice({
  name: ACCOUNT_SLICE_NAME,
  initialState,
  reducers: {
    updateAccountStatement(
      state,
      { payload }: PayloadAction<AccountProps['accountStatementInfo']>,
    ) {
      state.accountStatementInfo = {
        ...state.accountStatementInfo,
        ...payload,
      };
      console.log(state.accountStatementInfo, 'state.accountStatementInfo');
      return state;
    },
    removeAccountStatement(state, { payload }: PayloadAction<string>) {
      const data = state.accountStatementInfo;
      delete data[payload];
      state.accountStatementInfo = {
        ...data,
      };
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountStatement, removeAccountStatement } = accountSlice.actions;

export type TAccountSlice = {
  [ACCOUNT_SLICE_NAME]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
