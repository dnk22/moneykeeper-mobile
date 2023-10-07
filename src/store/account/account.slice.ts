import { createSlice } from '@reduxjs/toolkit';

type AccountProps = {};

//set default data

const initialState: AccountProps = {};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = accountSlice.actions;

export type TAccountSlice = {
  [accountSlice.name]: ReturnType<(typeof accountSlice)['reducer']>;
};

export default accountSlice.reducer;
