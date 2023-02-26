import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { accountAdapter, accountSlice, accountTypeAdapter, bankAdapter } from './account.slice';

const accountState = (state: RootState) => state[accountSlice.name].account;
const accountTypeState = (state: RootState) => state[accountSlice.name].account_type;
const bankState = (state: RootState) => state[accountSlice.name].bank;

// export selectors
export const accountSelectors = accountAdapter.getSelectors(accountState);
export const accountTypeSelectors = accountTypeAdapter.getSelectors(accountTypeState);
export const bankSelectors = bankAdapter.getSelectors(bankState);

// export custom selector

export const selectActiveAccounts = createSelector([accountSelectors.selectAll], (accounts) =>
  accounts.filter((account) => account.isActive),
);

export const selectDeactivateActiveAccounts = createSelector(
  [accountSelectors.selectAll],
  (accounts) => accounts.filter((account) => !account.isActive),
);

export const selectFistAccounts = createSelector(
  [accountSelectors.selectAll],
  (accounts) => accounts.filter((account) => account.isActive)[0],
);

export const selectAccountById = createSelector(
  [accountSelectors.selectById],
  (account) => account,
);

export const selectAllAccountType = createSelector(
  [accountTypeSelectors.selectEntities],
  (accountType) => accountType,
);

export const selectAllBank = createSelector([bankSelectors.selectEntities], (banks) => banks);
