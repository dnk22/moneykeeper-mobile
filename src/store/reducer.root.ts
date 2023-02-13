import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { reduxPersistStorage } from 'share/storage';

import appReducer, { appSlice } from './app/app.slice';
import accountReducer, { accountSlice } from './account/account.slice';
import transactionsReducer, { transactionsSlice } from './transactions/transactions.slice';

const appPersistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage,
  // blacklist: ['account'],
};

const allReducer = combineReducers({
  [appSlice.name]: appReducer,
  [accountSlice.name]: accountReducer,
  [transactionsSlice.name]: transactionsReducer,
});

export const persistedReducer = persistReducer(appPersistConfig, allReducer);
