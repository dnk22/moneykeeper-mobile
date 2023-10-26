export const CREATE_MODE = 'create';
export const RECENT = 'lastUseAt';
export const MOST = 'useCount';
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

export enum TRANSACTION_CATEGORY_TYPE {
  EXPENSE,
  INCOME,
}

export enum TRANSACTION_TYPE {
  EXPENSE,
  INCOME,
  TRANSFER,
  ADJUSTMENT,
}

export const MAP_LEND_BORROW: any = {
  ['COLLECT_DEBTS']: TRANSACTION_TYPE.INCOME,
  ['REPAYMENT']: TRANSACTION_TYPE.EXPENSE,
};

export enum BANK_TYPE {
  BANK,
  WALLET,
  INVESTMENT,
}
