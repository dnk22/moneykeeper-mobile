import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { accountSlice, accountTypeAdapter } from './account.slice';

const accountTypeState = (state: RootState) => state[accountSlice.name].accountType;
const bankIdSelectedState = (state: RootState) => state[accountSlice.name].bankIdSelected;
const selectModeState = (state: RootState) => state[accountSlice.name].isSelectMode;

// export selectors
export const accountTypeSelectors = accountTypeAdapter.getSelectors(accountTypeState);

// export custom selector
export const selectBankIdSelected = createSelector(bankIdSelectedState, (bank) => bank);

export const selectDefaultAccountType = createSelector(
  [accountTypeSelectors.selectById],
  (accountType) => accountType,
);

export const selectAllAccountType = createSelector(
  [accountTypeSelectors.selectAll],
  (accountType) => accountType,
);

export const selectIsSelectMode = createSelector(selectModeState, (isSelect) => isSelect);
