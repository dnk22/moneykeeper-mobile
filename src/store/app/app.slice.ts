import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FLAT, VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constant/index';
import { AccountViewSettingsProps, AppStateProps } from 'utils/types';

const initialState = {
  accountViewSettings: {
    sort: 'accountName',
    group: true,
    isViewActive: true,
  },
  isReportViewByGrid: false,
  transactionListDisplayConfig: {
    income: true,
    expense: true,
    amount: true,
    description: true,
  },
  homeBottomBarType: FLAT,
  viewCategoryMostAndRecent: VIEW_CATEGORY_FAST_BY_COLUMN.MOST,
} as AppStateProps;

export const appSlice = createSlice({
  name: 'appConfig',
  initialState: initialState,
  reducers: {
    updateAppConfig(state, { payload }: PayloadAction<AppStateProps>) {
      state = {
        ...state,
        ...payload,
      };
    },
    updateAccountViewSettings(
      state,
      { payload }: PayloadAction<Partial<AccountViewSettingsProps>>,
    ) {
      state.accountViewSettings = { ...state.accountViewSettings, ...payload };
    },
    updateReportViewSettings(state) {
      state.isReportViewByGrid = !state.isReportViewByGrid;
    },
    updateTransactionListDisplayConfig(state, { payload }: PayloadAction<Record<string, boolean>>) {
      state.transactionListDisplayConfig = {
        ...state.transactionListDisplayConfig,
        ...payload,
      };
    },
    updateHomeBottomBarType(state, { payload }: PayloadAction<AppStateProps['homeBottomBarType']>) {
      state.homeBottomBarType = payload;
    },
    updateViewCategoryMostAndRecent(
      state,
      { payload }: PayloadAction<AppStateProps['viewCategoryMostAndRecent']>,
    ) {
      state.viewCategoryMostAndRecent = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateAppConfig,
  updateAccountViewSettings,
  updateReportViewSettings,
  updateTransactionListDisplayConfig,
  updateHomeBottomBarType,
  updateViewCategoryMostAndRecent,
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
