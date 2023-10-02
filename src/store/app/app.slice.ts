import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MOST, RECENT, FLAT, STICKY } from 'utils/constant/index';

type MostOrRecentModeProps = {
  expense: typeof RECENT | typeof MOST;
  income: typeof RECENT | typeof MOST;
};

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
  isMostRecentMode: MostOrRecentModeProps;
  transactionListConfig: TransactionListConfig;
  homeBottomBarType: typeof FLAT | typeof STICKY;
  accountListExpand: {
    active?: boolean;
    inActive?: boolean;
  };
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
    isShowDescription: true,
    isShowAmountAfterTransaction: true,
    isShowExpense: true,
    isShowIncome: true,
  },
  homeBottomBarType: FLAT,
  accountListExpand: {
    active: false,
    inActive: false,
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
    updateHomeBottomBarType(state, { payload }: PayloadAction<AppState['homeBottomBarType']>) {
      state.homeBottomBarType = payload;
    },
    updateAccountListExpand(state, { payload }: PayloadAction<AppState['accountListExpand']>) {
      state.accountListExpand = { ...state.accountListExpand, ...payload };
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
  updateHomeBottomBarType,
  updateAccountListExpand,
} = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
