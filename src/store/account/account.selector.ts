import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import {
  accountAdapter,
  accountSlice,
  accountTypeAdapter,
  providerAdapter,
  bankAdapter,
} from './account.slice';

const accountState = (state: RootState) => state[accountSlice.name].account;
const accountTypeState = (state: RootState) => state[accountSlice.name].account_type;
const providerState = (state: RootState) => state[accountSlice.name].provider;
const bankState = (state: RootState) => state[accountSlice.name].bank;

// export selectors
export const accountSelectors = accountAdapter.getSelectors(accountState);
export const accountTypeSelectors = accountTypeAdapter.getSelectors(accountTypeState);
export const providerSelectors = providerAdapter.getSelectors(providerState);
export const bankSelectors = bankAdapter.getSelectors(bankState);

// export custom selector

export const selectActiveAccounts = createSelector([accountSelectors.selectAll], (accounts) =>
  accounts.filter((account) => account.is_active),
);

export const selectDeactivateActiveAccounts = createSelector(
  [accountSelectors.selectAll],
  (accounts) => accounts.filter((account) => !account.is_active),
);

export const selectFistAccounts = createSelector(
  [accountSelectors.selectAll],
  (accounts) => accounts.filter((account) => account.is_active)[0],
);

export const selectAccountById = createSelector(
  [accountSelectors.selectById],
  (account) => account,
);

export const selectAllAccountType = createSelector(
  [accountTypeSelectors.selectAll],
  (accountType) => accountType,
);

export const selectAllProvider = createSelector(
  [providerSelectors.selectAll],
  (providers) => providers,
);

export const selectAllBank = createSelector([bankSelectors.selectAll], (banks) => banks);
