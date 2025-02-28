import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

import appReducer, { APP_SLICE_NAME } from './app/app.slice';
import accountReducer, { ACCOUNT_SLICE_NAME } from './account/account.slice';
import transactionCategoryReducer, {
  TRANSACTION_CATEGORY_SLICE_NAME,
} from './transactionCategory/transactionCategory.slice';
import transactionsReducer, { TRANSACTION_SLICE_NAME } from './transactions/transactions.slice';
import financialStatementReducer, {
  FINANCE_STATEMENT_SLICE_NAME,
} from 'features/Report/FinancialStatement/reducer/financialStatement.slice';
import { reduxPersistStorage } from 'services/storage';

const appPersistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage,
  blacklist: [
    // TRANSACTION_SLICE_NAME,
    // ACCOUNT_SLICE_NAME,
    // TRANSACTION_CATEGORY_SLICE_NAME,
    APP_SLICE_NAME,
    FINANCE_STATEMENT_SLICE_NAME,
  ],
};

const transactionPersistConfig = {
  key: TRANSACTION_SLICE_NAME,
  storage: reduxPersistStorage,
  blacklist: ['refreshTransactionHistory'],
};

// const accountPersistConfig = {
//   key: ACCOUNT_SLICE_NAME,
//   storage: reduxPersistStorage,
//   blacklist: [''],
// };

const allReducer = combineReducers({
  [APP_SLICE_NAME]: appReducer,
  [TRANSACTION_CATEGORY_SLICE_NAME]: transactionCategoryReducer,
  [ACCOUNT_SLICE_NAME]: accountReducer,
  [TRANSACTION_SLICE_NAME]: persistReducer(transactionPersistConfig, transactionsReducer),
  [FINANCE_STATEMENT_SLICE_NAME]: financialStatementReducer,
});

export const persistedReducer = persistReducer(appPersistConfig, allReducer);
