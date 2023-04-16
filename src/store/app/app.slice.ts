import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MOST, RECENT } from 'utils/constant/index';

type AccountViewSettingsProps = {
  sort: 'name' | 'custom';
  group: boolean;
};

type MostOrRecentModeProps = {
  expense: typeof RECENT | typeof MOST;
  income: typeof RECENT | typeof MOST;
};

type AppState = {
  account_view_settings: AccountViewSettingsProps;
  is_report_view: 'grid' | 'list';
  isMostOrRecentMode: MostOrRecentModeProps;
};

const initialState = {
  account_view_settings: {
    sort: 'name',
    group: true,
  },
  is_report_view: 'grid',
  isMostOrRecentMode: {
    expense: RECENT,
    income: RECENT,
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
    updateReportViewSettings(state) {
      state.is_report_view = state.is_report_view === 'grid' ? 'list' : 'grid';
    },
    updateMostOrRecentMode(state, { payload }: PayloadAction<MostOrRecentModeProps>) {
      state.isMostOrRecentMode = {
        ...state.isMostOrRecentMode,
        ...payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAccountViewSettings, updateReportViewSettings, updateMostOrRecentMode } =
  appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
