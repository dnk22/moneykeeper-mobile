export const CREATE_MODE = 'create';
export const LEND = 'lend';
export const BORROW = 'borrow';
export const COLLECT_DEBTS = 'collectDebts';
export const REPAYMENT = 'repayment';
export const RECENT = 'last_use_at';
export const MOST = 'use_count';

export enum TRANSACTION_CATEGORY_TYPE {
  EXPENSE,
  INCOME,
  LEND_BORROW,
}

export enum TRANSACTION_TYPE {
  EXPENSE,
  INCOME,
  LEND,
  BORROW,
  TRANSFER,
  ADJUSTMENT,
}

export const MAP_LEND_BORROW: any = {
  [LEND]: TRANSACTION_TYPE.LEND,
  [BORROW]: TRANSACTION_TYPE.BORROW,
  [COLLECT_DEBTS]: TRANSACTION_TYPE.INCOME,
  [REPAYMENT]: TRANSACTION_TYPE.EXPENSE,
};

export const FLAT = 'flat';
export const STICKY = 'sticky';
export const BASE_URL = '';
