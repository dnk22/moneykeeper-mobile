import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FLAT, VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constant/index';
import { AccountViewSettingsProps, AppStateProps, TransactionListConfigProps } from 'utils/types';

const initialState = {
  accountViewSettings: {
    sort: 'accountName',
    group: true,
    isViewActive: true,
  },
  isReportViewByGrid: false,
  transactionListConfig: {
    isShowDescription: true,
    isShowAmountAfterTransaction: true,
    isShowExpense: true,
    isShowIncome: true,
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
    updateTransactionListConfig(state, { payload }: PayloadAction<TransactionListConfigProps>) {
      state.transactionListConfig = {
        ...state.transactionListConfig,
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
  updateTransactionListConfig,
  updateHomeBottomBarType,
  updateViewCategoryMostAndRecent,
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
