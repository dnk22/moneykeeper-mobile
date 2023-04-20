import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MOST, RECENT } from 'utils/constant/index';

type MostOrRecentModeProps = {
  expense: typeof RECENT | typeof MOST;
  income: typeof RECENT | typeof MOST;
};

type AccountViewSettingsProps = {
  sort: 'name' | 'custom';
  group: boolean;
};

type TransactionListConfig = {
  isLimitDisplayTransaction: boolean;
  isShowDescription: boolean;
  isShowAmountAfterTransaction: boolean;
  isShowExpense: boolean;
  isShowIncome: boolean;
};

type AppState = {
  accountViewSettings: AccountViewSettingsProps;
  isReportViewByGrid: boolean;
  isMostRecentMode: MostOrRecentModeProps;
  transactionListConfig: TransactionListConfig;
};

const initialState = {
  accountViewSettings: {
    sort: 'name',
    group: true,
  },
  isReportViewByGrid: false,
  isMostRecentMode: {
    expense: RECENT,
    income: RECENT,
  },
  transactionListConfig: {
    isLimitDisplayTransaction: false,
    isShowDescription: true,
    isShowAmountAfterTransaction: true,
    isShowExpense: true,
    isShowIncome: true,
  },
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
    updateMostOrRecentMode(state, { payload }: PayloadAction<MostOrRecentModeProps>) {
      state.isMostRecentMode = {
        ...state.isMostRecentMode,
        ...payload,
      };
    },
    updateTransactionListConfig(state, { payload }: PayloadAction<TransactionListConfig>) {
      state.transactionListConfig = {
        ...state.transactionListConfig,
        ...payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateAppConfig,
  updateAccountViewSettings,
  updateReportViewSettings,
  updateMostOrRecentMode,
  updateTransactionListConfig,
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
