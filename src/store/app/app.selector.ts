import { appSlice } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const accountViewSettingsState = (state: RootState) => state[appSlice.name].accountViewSettings;
const reportViewSettingsState = (state: RootState) => state[appSlice.name].isReportViewByGrid;
const mostOrRecentModeState = (state: RootState) => state[appSlice.name].isMostRecentMode;
const transactionListConfigState = (state: RootState) => state[appSlice.name].transactionListConfig;
const homeBottomBarTypeState = (state: RootState) => state[appSlice.name].homeBottomBarType;
const accountListExpandState = (state: RootState) => state[appSlice.name].accountListExpand;

// export selectors
export const selectAccountViewSettings = createSelector(
  accountViewSettingsState,
  (settings) => settings,
);
export const selectReportViewSettings = createSelector(reportViewSettingsState, (state) => state);
export const selectMostOrRecentMode = createSelector(mostOrRecentModeState, (mode) => mode);
export const selectTransactionListConfig = createSelector(
  transactionListConfigState,
  (config) => config,
);
export const selectHomeBottomBarType = createSelector(homeBottomBarTypeState, (state) => state);
export const selectAccountListExpandState = createSelector(
  accountListExpandState,
  (state) => state,
);
