import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionCategorySlice } from './transactionCategory.slice';

const tabSelectedState = (state: RootState) => state[transactionCategorySlice.name].isTabSelected;
const parentState = (state: RootState) => state[transactionCategorySlice.name].parentSelected;

// export custom selector
export const selectTabActive = createSelector(tabSelectedState, (tab) => tab);
export const selectParentGroup = createSelector(parentState, (parent) => parent);
