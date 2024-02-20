import { appSlice } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const appState = (state: RootState) => state[appSlice.name];

// export selectors
export const selectAccountViewSettings = createSelector(
  appState,
  (state) => state.accountViewSettings,
);

export const selectReportViewSettings = createSelector(
  appState,
  (state) => state.isReportViewByGrid,
);

export const selectTransactionListConfig = createSelector(
  appState,
  (state) => state.transactionListDisplayConfig,
);

export const selectHomeBottomBarType = createSelector(appState, (state) => state.homeBottomBarType);

export const selectViewCategoryMostAndRecent = createSelector(
  appState,
  (state) => state.viewCategoryMostAndRecent,
);
export const selectWidgetOrder = createSelector(appState, (state) => state.widgetOrder);
