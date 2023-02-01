import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const appState = (state: RootState) => state.app;

// export selectors

export const accountViewSettingsSelector = createSelector(
  appState,
  (state) => state.AccountViewSettings,
);
