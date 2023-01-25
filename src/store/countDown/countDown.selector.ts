import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/index';
import {
  countDownAdapter,
  TCountDownSlice,
  countDownSlice,
  categoryAdapter,
} from './countDown.slice';

const countDownState = (state: RootState) => state.countDown;

// export selectors
export const countDownSelectors =
  countDownAdapter.getSelectors<TCountDownSlice>(
    (state) => state[countDownSlice.name].countDown
  );

export const countDownCategorySelectors =
  categoryAdapter.getSelectors<TCountDownSlice>(
    (state) => state[countDownSlice.name].category
  );

export const homeCategorySelectors = createSelector(
  countDownState,
  (state) => state.homeCategory
);
