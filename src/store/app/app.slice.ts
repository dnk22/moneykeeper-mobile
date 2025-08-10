import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import defaultSettings from 'utils/constants/appSettings';
import { AppStateProps } from 'utils/types/store.type';
import { updateCategoriesConfig } from './app.thunk';

const initialState = {
  ...defaultSettings,
  authState: {
    isLoggedIn: false,
    isOnboarded: false,
  },
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
    updateAppLoading(state, { payload }: PayloadAction<AppStateProps['appLoading']>) {
      state.appLoading = payload;
    },
    updateAppAuthState(state, { payload }: PayloadAction<Partial<AppStateProps['authState']>>) {
      state.authState = produce(state.authState, (draft) => {
        Object.assign(draft, payload);
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCategoriesConfig.fulfilled, (state, action) => {
      Object.assign(state.categories, action.payload);
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  updateAppConfig,
  updateAccountViewSettings,
  updateTransactionConfig,
  updateAppearanceConfig,
  updateAppLoading,
  updateAppAuthState,
} = appSlice.actions;

export type TAppSlice = {
  [APP_SLICE_NAME]: ReturnType<(typeof appSlice)['reducer']>;
};

export default appSlice.reducer;
