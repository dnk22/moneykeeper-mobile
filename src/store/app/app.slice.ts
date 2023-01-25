import { alertInitialState } from 'utils/constant';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AlertItemProps } from 'types';

export const alertAdapter = createEntityAdapter<AlertItemProps>();

const getAlertInitialState = alertAdapter.upsertMany(
  alertAdapter.getInitialState(),
  alertInitialState
);

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    alertSettings: getAlertInitialState,
  },
  reducers: {
    addOrEditAlert: (state, { payload }: PayloadAction<AlertItemProps>) => {
      alertAdapter.upsertOne(state.alertSettings, payload);
    },
    deleteAlertByValue: (state, { payload }: PayloadAction<string>) => {
      alertAdapter.removeOne(state.alertSettings, payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addOrEditAlert, deleteAlertByValue } = appSlice.actions;

export type TAppSlice = {
  [appSlice.name]: ReturnType<typeof appSlice['reducer']>;
};

export default appSlice.reducer;
