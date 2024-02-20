import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { WIDGET_INIT_LIST } from 'features/Dashboard/constants';
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
  widgetOrder: WIDGET_INIT_LIST,
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
      return state;
    },
    updateWidgetOrder(state, { payload }: PayloadAction<AppStateProps['widgetOrder']>) {
      state.widgetOrder = payload;
      return state;
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
  updateWidgetOrder,
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
