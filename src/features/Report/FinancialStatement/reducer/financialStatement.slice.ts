import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { financialStatementProps } from '../types';

const initialState = {
  isOwnedViewType: true,
  dataDetailLv1: [],
  dataDetailLv2: '',
  pageView: 0,
  total: 0,
  refreshData: 0,
} as financialStatementProps;

export const FINANCE_STATEMENT_SLICE_NAME = 'financeStatementStore';

export const financialStatementSlice = createSlice({
  name: FINANCE_STATEMENT_SLICE_NAME,
  initialState: initialState,
  reducers: {
    setViewType(state, { payload }: PayloadAction<boolean>) {
      state.isOwnedViewType = payload;
      state.pageView = 0;
      state.dataDetailLv2 = '';
    },
    setDataDetailLv1(state, { payload }: PayloadAction<any>) {
      state.dataDetailLv1 = payload;
    },
    setDataDetailLv2(state, { payload }: PayloadAction<string>) {
      state.dataDetailLv2 = payload;
    },
    setTotal(state, { payload }: PayloadAction<number>) {
      state.total = payload;
    },
    setRefreshData(state) {
      state.refreshData += 1;
    },
    setPageView(state, { payload }: PayloadAction<{ page: number; resetLv2: boolean }>) {
      state.pageView = payload.page;
      if (payload.resetLv2) {
        state.dataDetailLv2 = '';
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setViewType,
  setDataDetailLv1,
  setTotal,
  setDataDetailLv2,
  setPageView,
  setRefreshData,
} = financialStatementSlice.actions;

export type TTransactionCategorySlice = {
  [FINANCE_STATEMENT_SLICE_NAME]: ReturnType<(typeof financialStatementSlice)['reducer']>;
};

export default financialStatementSlice.reducer;
