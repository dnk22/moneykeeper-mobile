import { appSlice } from './app.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const accountViewSettingsState = (state: RootState) => state[appSlice.name].account_view_settings;

// init selectors

// export selectors
export const selectAccountViewSettings = createSelector(accountViewSettingsState, (state) => state);
