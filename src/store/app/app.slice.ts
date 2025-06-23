import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { defaultSettings } from 'utils/constants/appSettings';
import { AppStateProps } from 'utils/types/store.type';

const initialState = {
  ...defaultSettings,
  appLoading: false,
} as AppStateProps;

export const APP_SLICE_NAME = 'appConfig';

export const appSlice = createSlice({
  name: APP_SLICE_NAME,
  initialState: initialState,
  reducers: {
    updateAppConfig(state, { payload }: PayloadAction<Partial<AppStateProps>>) {
      Object.assign(state, payload);
    },
    updateAppearanceConfig(
      state,
      { payload }: PayloadAction<Partial<AppStateProps['appearance']>>,
    ) {
      Object.assign(state.appearance, payload);
    },
    updateAccountViewSettings(
      state,
      { payload }: PayloadAction<Partial<AppStateProps['accounts']>>,
    ) {
      Object.assign(state.accounts, payload);
    },
    updateTransactionConfig(
      state,
      { payload }: PayloadAction<Partial<AppStateProps['transactions']>>,
    ) {
      Object.assign(state.transactions, payload);
    },
    updateCategoriesConfig(state, { payload }: PayloadAction<AppStateProps['categories']>) {
      state.categories = payload;
    },
    updateAppLoading(state, { payload }: PayloadAction<AppStateProps['appLoading']>) {
      state.appLoading = produce(state.appLoading, (draft) => {
        draft = payload;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateAppConfig,
  updateAccountViewSettings,
  updateTransactionConfig,
  updateCategoriesConfig,
  updateAppearanceConfig,
  updateAppLoading,
} = appSlice.actions;

export type TAppSlice = {
  [APP_SLICE_NAME]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
