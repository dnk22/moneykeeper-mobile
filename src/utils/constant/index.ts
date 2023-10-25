export const CREATE_MODE = 'create';
export const LEND = 'Cho vay';
export const BORROW = 'Đi vay';
export const COLLECT_DEBTS = 'Thu nợ';
export const REPAYMENT = 'Trả nợ';
export const RECENT = 'lastUseAt';
export const MOST = 'useCount';
export const FLAT = 'flat';
export const STICKY = 'sticky';
export const BASE_URL = '';
export const DAY_IN_MONTH = Array.from({ length: 31 }, (v, k) => k + 1);

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

export enum BANK_TYPE {
  BANK,
  WALLET,
  INVESTMENT,
}
