import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AccountViewSettingsProps = {
  sort: 'name' | 'custom';
  group: boolean;
};

type AppState = {
  account_view_settings: AccountViewSettingsProps;
};

const initialState = {
  account_view_settings: {
    sort: 'name',
    group: true,
  },
} as AppState;

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateAccountViewSettings(
      state,
      { payload }: PayloadAction<Partial<AccountViewSettingsProps>>,
    ) {
      state.account_view_settings = { ...state.account_view_settings, ...payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountViewSettings } = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
