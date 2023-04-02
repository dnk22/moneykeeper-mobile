export const logBoxIgnore = [
  "Module RNCColorPicker requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules on a background thread unless explicitly opted-out of.",
  "[🍉] The reader you're trying to run (unnamed) can't be performed yet, because there are 1 other readers/writers in the queue. Current reader: unnamed. If everything is working fine, you can safely ignore this message (queueing is working as expected). But if your readers/writers are not running, it's because the current reader is stuck. Remember that if you're calling a reader/writer from another reader/writer, you must use callReader()/callWriter(). See docs for more details.",
  'If everything is working fine, you can safely ignore this message (queueing is working as expected)',
];

export const CREATE_MODE = 'create';

export const LEND = 'lend';
export const BORROW = 'borrow';
export const COLLECT_DEBTS = 'collectDebts';
export const REPAYMENT = 'repayment';

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

export const MAP_LEND_BORROW = {
  [LEND]: TRANSACTION_TYPE.LEND,
  [BORROW]: TRANSACTION_TYPE.BORROW,
  [COLLECT_DEBTS]: TRANSACTION_TYPE.INCOME,
  [REPAYMENT]: TRANSACTION_TYPE.EXPENSE,
};
