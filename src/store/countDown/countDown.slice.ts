import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import { TCountDown, ICountDownCategory } from 'features/CountDown/type';

const OTHER_CATEGORY = '5';

export const countDownAdapter = createEntityAdapter<TCountDown>();
export const categoryAdapter = createEntityAdapter<ICountDownCategory>();

export const countDownSlice = createSlice({
  name: 'countDown',
  initialState: {
    countDown: countDownAdapter.getInitialState(),
    category: categoryAdapter.getInitialState(),
    homeCategory: {},
  },
  reducers: {
    addOrUpdateCountDown: (state, { payload }: PayloadAction<TCountDown>) => {
      const data = {
        ...payload,
        name: payload.name || 'Không có tên',
        categoryId: payload.categoryId || OTHER_CATEGORY,
        categoryName: payload.categoryName || 'Khác',
        id: payload.id || nanoid(),
      };
      countDownAdapter.upsertOne(state.countDown, data);
    },
    deleteCountDownById(state, { payload }: PayloadAction<string>) {
      countDownAdapter.removeOne(state.countDown, payload);
    },
    clearAllCountDown: (state) => {
      countDownAdapter.removeAll(state.countDown);
    },
    setHomeCategory: (state, { payload }: PayloadAction<string>) => {
      state.homeCategory = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addOrUpdateCountDown, clearAllCountDown, deleteCountDownById } =
  countDownSlice.actions;

export type TCountDownSlice = {
  [countDownSlice.name]: ReturnType<typeof countDownSlice['reducer']>;
};

export default countDownSlice.reducer;
