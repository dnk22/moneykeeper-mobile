import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { financialStatementSlice } from './financialStatement.slice';

const financialStatementState = (state: RootState) => state[financialStatementSlice.name];

// export custom selector
export const selectViewType = createSelector(
  financialStatementState,
  (data) => data.isOwnedViewType,
);
export const selectDataSummary = createSelector(
  financialStatementState,
  (data) => data.dataSummary,
);
export const selectDataDetail = createSelector(
  financialStatementState,
  (data) => data.dataDetail,
);
export const selectPageView = createSelector(financialStatementState, (data) => data.pageView);
export const selectRefreshData = createSelector(financialStatementState, (data) => data.refreshData);
