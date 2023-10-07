import { appSlice } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const accountViewSettingsState = (state: RootState) => state[appSlice.name].accountViewSettings;
const reportViewSettingsState = (state: RootState) => state[appSlice.name].isReportViewByGrid;
const transactionListConfigState = (state: RootState) => state[appSlice.name].transactionListConfig;
const homeBottomBarTypeState = (state: RootState) => state[appSlice.name].homeBottomBarType;

// export selectors
export const selectAccountViewSettings = createSelector(
  accountViewSettingsState,
  (settings) => settings,
);
export const selectReportViewSettings = createSelector(reportViewSettingsState, (state) => state);
export const selectTransactionListConfig = createSelector(
  transactionListConfigState,
  (config) => config,
);
export const selectHomeBottomBarType = createSelector(homeBottomBarTypeState, (state) => state);

