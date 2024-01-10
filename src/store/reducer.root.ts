import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { reduxPersistStorage } from 'share/storage';

import appReducer, { appSlice } from './app/app.slice';
import accountReducer, { accountSlice } from './account/account.slice';
import transactionCategoryReducer, {
  transactionCategorySlice,
} from './transactionCategory/transactionCategory.slice';
// import transactionsReducer, { transactionsSlice } from './transactions/transactions.slice';

const appPersistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage,
  blacklist: [
    // transactionsSlice.name,
    // accountSlice.name,
    // transactionCategorySlice.name,
    // appSlice.name,
  ],
};

// const transactionPersistConfig = {
//   key: transactionsSlice.name,
//   storage: reduxPersistStorage,
//   blacklist: [
//     'transactionAccountSelected',
//     'transactionCategorySelected',
//     'transactionTypeIdSelected',
//   ],
// };

// const accountPersistConfig = {
//   key: accountSlice.name,
//   storage: reduxPersistStorage,
//   blacklist: [''],
// };

const allReducer = combineReducers({
  [appSlice.name]: appReducer,
  [transactionCategorySlice.name]: transactionCategoryReducer,
  [accountSlice.name]: accountReducer,
  // [transactionsSlice.name]: persistReducer(transactionPersistConfig, transactionsReducer),
});

export const persistedReducer = persistReducer(appPersistConfig, allReducer);
