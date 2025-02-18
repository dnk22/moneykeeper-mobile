import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { WIDGET_INIT_LIST } from 'features/Dashboard/constants';
import { produce } from 'immer';
import { COLOR_SCHEME } from 'resources/theme/constants';
import { FLAT, VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constants/index';
import { AccountViewSettingsProps, AppStateProps } from 'utils/types/store.type';

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
  theme: {
    auto: true,
    darkMode: false,
    color: COLOR_SCHEME.modernBlue,
  },
} as AppStateProps;

export const APP_SLICE_NAME = 'appConfig';

export const appSlice = createSlice({
  name: APP_SLICE_NAME,
  initialState: initialState,
  reducers: {
    updateAppConfig(state, { payload }: PayloadAction<Partial<AppStateProps>>) {
      Object.assign(state, payload);
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
    updateTransactionListDisplayConfig(
      state,
      { payload }: PayloadAction<Partial<AppStateProps['transactionListDisplayConfig']>>,
    ) {
      Object.assign(state.transactionListDisplayConfig, payload);
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
    updateWidgetOrder(state, { payload }: PayloadAction<AppStateProps['widgetOrder']>) {
      state.widgetOrder = produce(state.widgetOrder, (draft) => {
        draft.splice(0, draft.length, ...payload);
      });
    },
    updateTheme(state, { payload }: PayloadAction<Partial<AppStateProps['theme']>>) {
      Object.assign(state.theme, payload);
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
  updateTheme,
} = appSlice.actions;

export type TAppSlice = {
  [APP_SLICE_NAME]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
