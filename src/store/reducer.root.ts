import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { reduxPersistStorage } from 'share/storage';

import appReducer, { appSlice } from './app/app.slice';
import accountReducer, { accountSlice } from './account/account.slice';
import transactionsReducer, { transactionsSlice } from './transactions/transactions.slice';
import transactionCategoryReducer, {
  transactionCategorySlice,
} from './transactionCategory/transactionCategory.slice';

const appPersistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage,
  blacklist: [
    transactionsSlice.name,
    accountSlice.name,
    transactionCategorySlice.name,
    // appSlice.name,
  ],
};

const transactionsConfig = {
  key: transactionsSlice.name,
  storage: reduxPersistStorage,
  blacklist: [
    'transactionAccountSelected',
    'transactionCategorySelected',
    'transactionTypeIdSelected',
  ],
};

const accountConfig = {
  key: accountSlice.name,
  storage: reduxPersistStorage,
  blacklist: ['bankIdSelected'],
};

const allReducer = combineReducers({
  [appSlice.name]: appReducer,
  [accountSlice.name]: persistReducer(accountConfig, accountReducer),
  [transactionsSlice.name]: persistReducer(transactionsConfig, transactionsReducer),
  [transactionCategorySlice.name]: transactionCategoryReducer,
});

export const persistedReducer = persistReducer(appPersistConfig, allReducer);
