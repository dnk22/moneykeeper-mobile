import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { financialStatementSlice } from './financialStatement.slice';

const financialStatementState = (state: RootState) => state[financialStatementSlice.name];

// export custom selector
export const selectViewType = createSelector(
  financialStatementState,
  (data) => data.isOwnedViewType,
);
export const selectDataDetailLevel1 = createSelector(
  financialStatementState,
  (data) => data.dataDetailLv1,
);
export const selectDataDetailLevel2 = createSelector(
  financialStatementState,
  (data) => data.dataDetailLv2,
);
export const selectPageView = createSelector(financialStatementState, (data) => data.pageView);
export const selectTotal = createSelector(financialStatementState, (data) => data.total);
