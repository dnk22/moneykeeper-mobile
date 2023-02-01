import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountViewSettingsProps = {
  sort?: 'name' | 'custom';
  group?: boolean;
};
type AppState = {
  AccountViewSettings: AccountViewSettingsProps;
};

const initialState = {
  AccountViewSettings: {
    sort: 'name',
    group: true,
  },
} as AppState;

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateAccountViewSettings(state, { payload }: PayloadAction<AccountViewSettingsProps>) {
      state.AccountViewSettings = { ...state.AccountViewSettings, ...payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountViewSettings } = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
