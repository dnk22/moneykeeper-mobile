import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const alertAdapter = createEntityAdapter<any>();


export const appSlice = createSlice({
  name: 'app',
  initialState: {
    alertSettings: [],
  },
  reducers: {
    addOrEditAlert: (state, { payload }: PayloadAction<any>) => {
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
