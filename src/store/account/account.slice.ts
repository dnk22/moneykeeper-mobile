import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountProps = {
  accountStatementInfo: Record<string, Record<string, number>>;
  accountNotifications: Record<string, string | undefined>;
};

//set default data
const initialState: AccountProps = {
  accountStatementInfo: {},
  accountNotifications: {},
};

export const accountSlice = createSlice({
  name: 'account',
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
    updateAccountNotification(
      state,
      { payload }: PayloadAction<AccountProps['accountNotifications']>,
    ) {
      const noti = {
        ...state.accountNotifications,
        ...payload,
      };
      if (!Object.values(payload)[0]) {
        delete noti[Object.keys(payload)[0]];
      }
      state.accountNotifications = {
        ...noti,
      };
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountStatement, removeAccountStatement, updateAccountNotification } =
  accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
