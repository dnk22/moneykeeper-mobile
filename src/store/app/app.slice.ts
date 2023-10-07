import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FLAT, STICKY } from 'utils/constant/index';

type AccountViewSettingsProps = {
  sort: 'name' | 'custom';
  group: boolean;
};

type TransactionListConfig = {
  isShowDescription: boolean;
  isShowAmountAfterTransaction: boolean;
  isShowExpense: boolean;
  isShowIncome: boolean;
};

type AppState = {
  accountViewSettings: AccountViewSettingsProps;
  isReportViewByGrid: boolean;
  transactionListConfig: TransactionListConfig;
  homeBottomBarType: typeof FLAT | typeof STICKY;
};

const initialState = {
  accountViewSettings: {
    sort: 'name',
    group: true,
  },
  isReportViewByGrid: false,
  transactionListConfig: {
    isShowDescription: true,
    isShowAmountAfterTransaction: true,
    isShowExpense: true,
    isShowIncome: true,
  },
  homeBottomBarType: FLAT,
} as AppState;

export const appSlice = createSlice({
  name: 'appConfig',
  initialState: initialState,
  reducers: {
    updateAppConfig(state, { payload }: PayloadAction<AppState>) {
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
    updateTransactionListConfig(state, { payload }: PayloadAction<TransactionListConfig>) {
      state.transactionListConfig = {
        ...state.transactionListConfig,
        ...payload,
      };
    },
    updateHomeBottomBarType(state, { payload }: PayloadAction<AppState['homeBottomBarType']>) {
      state.homeBottomBarType = payload;
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
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
