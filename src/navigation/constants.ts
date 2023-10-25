import { createContext } from "react";

export const HOME = 'home';

// dashboard screen constants
export const DASHBOARD = 'dashboard';

// settings screen constants
export const SETTINGS = 'settings';
export const APPEARANCE = 'appearance';

// account screen constants
export const ACCOUNT = 'account';
export const ACCOUNTTAB = 'accountTab';
export const WALLET = 'wallet';
export const SAVINGS = 'savings';
export const ACCUMULATE = 'accumulate';
export const ADD_ACCOUNT = 'addAccount';
export const ACCOUNT_DETAIL = 'accountDetail';
export const CREATE_TRANSACTION_FROM_ACCOUNT = 'createTransactionFromAccount';

// transaction screen constants
export const TRANSACTIONS = 'transactions';
export const ADD_TRANSACTION = 'addTransaction';
export const TRANSACTION_CATEGORY = 'transactionCategory';
export const TRANSACTION_CATEGORY_LIST = 'transactionCategoryList';
export const UPDATE_TRANSACTION_CATEGORY = 'updateTransactionCategory';
export const PARENT_LIST = 'parentList';
export const ICON_SELECT = 'icon_select';
export const EXPENSE_CATEGORY = 'expenseCategory';
export const INCOME_CATEGORY = 'incomeCategory';
export const LEND_BORROW = 'lendBorrow';

// report screen constants
export const REPORT = 'report';
export const HOME_REPORT = 'homeReport';

// bank screen constants
export const BANK_NAVIGATION = 'bank';
export const BANK_HOME_LIST = 'bankHomeList';
export const TransactionCategoryContext = createContext({});
