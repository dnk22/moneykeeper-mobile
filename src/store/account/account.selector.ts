import { accountSlice } from './account.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';

const appState = (state: RootState) => state[accountSlice.name];

// export selectors
export const selectAccountStatementList = createSelector(
  appState,
  (state) => state.accountStatementInfo,
);
