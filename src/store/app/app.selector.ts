import { alertAdapter, TAppSlice, appSlice } from './app.slice';

// export selectors
export const alertSelectors = alertAdapter.getSelectors<TAppSlice>(
  (state) => state[appSlice.name].alertSettings
);
