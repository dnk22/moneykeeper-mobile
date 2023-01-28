import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';
import { accountAdapter, TAccountSlice, accountSlice, accountTypeAdapter } from './account.slice';

const accountState = (state: RootState) => state.account;

// export selectors
export const accountSelectors = accountAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].account,
);
export const accountTypeSelectors = accountTypeAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].account_type,
);
