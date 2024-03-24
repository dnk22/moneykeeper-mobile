export const CREATE_MODE = 'create';
export const VIEW_CATEGORY_FAST_BY_COLUMN = {
  MOST: 'useCount',
  RECENT: 'lastUseAt',
};
export const SORT_ACCOUNT_BY_KEY = {
  accountName: 'accountName',
  sortOrder: 'sortOrder',
};
export const FLAT = 'flat';
export const STICKY = 'sticky';
export const BASE_URL = '';
export const DAY_IN_MONTH = Array.from({ length: 31 }, (v, k) => k + 1);

export const TRANSACTION_LEND_BORROW_NAME = {
  LEND: 'Cho vay',
  BORROW: 'Đi vay',
  COLLECT_DEBTS: 'Thu nợ',
  REPAYMENT: 'Trả nợ',
};

export enum TRANSACTION_TYPE {
  EXPENSE,
  INCOME,
  TRANSFER,
  ADJUSTMENT,
}

export enum TRANSACTION_CATEGORY_TYPE {
  EXPENSE,
  INCOME,
}

export enum ACCOUNT_CATEGORY_ID {
  MONEY,
  BANK,
  CREDITCARD,
  INVESTMENT,
  EWALLET,
  OTHER,
}

export enum BANK_TYPE {
  BANK,
  WALLET,
  INVESTMENT,
}

export const MAP_LEND_BORROW: any = {
  ['COLLECT_DEBTS']: TRANSACTION_TYPE.INCOME,
  ['REPAYMENT']: TRANSACTION_TYPE.EXPENSE,
};


export const MATERIAL_COLOR = [
  '#F44336',
  '#2196F3',
  '#4CAF50',
  '#FF9800',
  '#9C27B0',
  '#03A9F4',
  '#8BC34A',
  '#FFC107',
  '#673AB7',
  '#00BCD4',
  '#CDDC39',
  '#FF5722',
  '#009688',
  '#FFEB3B',
  '#E91E63',
  '#00BCD4',
  '#FF5722',
  '#3F51B5',
  '#FFEB3B',
  '#8BC34A',
  '#FF5722',
  '#2196F3',
  '#FFC107',
  '#4CAF50',
  '#9C27B0',
  '#673AB7',
  '#F44336',
  '#03A9F4',
  '#9C27B0',
  '#FF9800',
  '#4CAF50',
  '#F44336',
  '#2196F3',
  '#FF9800',
  '#4CAF50',
  '#FF5722',
  '#03A9F4',
  '#FFC107',
  '#673AB7',
  '#00BCD4',
  '#FF5722',
  '#009688',
  '#FFEB3B',
  '#E91E63',
  '#8BC34A',
  '#00BCD4',
  '#FF5722',
  '#3F51B5',
  '#FFEB3B',
  '#8BC34A',
];
