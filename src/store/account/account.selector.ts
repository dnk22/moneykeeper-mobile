import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { accountSlice, accountTypeAdapter, bankAdapter } from './account.slice';

const accountTypeState = (state: RootState) => state[accountSlice.name].accountType;
const bankState = (state: RootState) => state[accountSlice.name].bank;

// export selectors
export const accountTypeSelectors = accountTypeAdapter.getSelectors(accountTypeState);
export const bankSelectors = bankAdapter.getSelectors(bankState);

// export custom selector

export const selectDefaultAccountType = createSelector(
  [accountTypeSelectors.selectById],
  (accountType) => accountType,
);

export const selectAllAccountType = createSelector(
  [accountTypeSelectors.selectAll],
  (accountType) => accountType,
);

export const selectAllBank = createSelector([bankSelectors.selectEntities], (banks) => banks);
