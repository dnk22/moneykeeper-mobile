import { RootState } from 'store/index';
import { createSelector } from '@reduxjs/toolkit';
import { transactionCategorySlice } from './transactionCategory.slice';

const parentState = (state: RootState) => state[transactionCategorySlice.name].parentSelected;
const updateModeState = (state: RootState) => state[transactionCategorySlice.name].isUpdateMode;

// export custom selector
export const selectParentGroup = createSelector(parentState, (parent) => parent);
export const selectUpdateModeStatus = createSelector(updateModeState, (mode) => mode);
