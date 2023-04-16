import { appSlice } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const accountViewSettingsState = (state: RootState) => state[appSlice.name].account_view_settings;
const reportViewSettingsState = (state: RootState) => state[appSlice.name].is_report_view;
const mostOrRecentModeState = (state: RootState) => state[appSlice.name].isMostOrRecentMode;

// export selectors
export const selectAccountViewSettings = createSelector(
  accountViewSettingsState,
  (settings) => settings,
);
export const selectReportViewSettings = createSelector(reportViewSettingsState, (state) => state);
export const selectMostOrRecentMode = createSelector(mostOrRecentModeState, (mode) => mode);
