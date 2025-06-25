import { APP_SLICE_NAME } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const appState = (state: RootState) => state[APP_SLICE_NAME];

// export selectors
export const selectAccountViewSettings = createSelector(appState, (state) => state.accounts);

export const selectTransactionConfig = createSelector(appState, (state) => state.transactions);

export const selectAppearanceConfig = createSelector(appState, (state) => state.appearance);

export const selectCategoriesConfig = createSelector(appState, (state) => state.categories);

export const selectAppLoadingState = createSelector(appState, (state) => state.appLoading);

export const selectAppAuthState = createSelector(appState, (state) => state.authState);
