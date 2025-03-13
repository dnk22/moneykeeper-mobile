import { TAccountType } from 'database/types';

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

export const ACCOUNT_TYPE_LIST: TAccountType[] = [
  {
    id: ACCOUNT_CATEGORY_ID.MONEY,
    name: 'Tiền mặt',
    value: 'cash',
    icon: 'cash',
  },
  {
    id: ACCOUNT_CATEGORY_ID.BANK,
    name: 'Tài khoản ngân hàng',
    value: 'bank',
    icon: 'bankAccountType',
  },
  {
    id: ACCOUNT_CATEGORY_ID.CREDITCARD,
    name: 'Thẻ tín dụng',
    value: 'credit',
    icon: 'creditCard',
  },
  {
    id: ACCOUNT_CATEGORY_ID.INVESTMENT,
    name: 'Tài khoản đầu tư',
    value: 'investment',
    icon: 'investment',
  },
  {
    id: ACCOUNT_CATEGORY_ID.EWALLET,
    name: 'Ví điện tử',
    value: 'eWallet',
    icon: 'eWallet',
  },
  {
    id: ACCOUNT_CATEGORY_ID.OTHER,
    name: 'Khác',
    value: 'other',
    icon: 'otherMoney',
  },
];

export const ACCOUNT_TYPE_LOGO: { [key: string]: string } = {
  [ACCOUNT_CATEGORY_ID.MONEY]: 'cash',
  [ACCOUNT_CATEGORY_ID.BANK]: 'bankAccountType',
  [ACCOUNT_CATEGORY_ID.CREDITCARD]: 'creditCard',
  [ACCOUNT_CATEGORY_ID.INVESTMENT]: 'investment',
  [ACCOUNT_CATEGORY_ID.EWALLET]: 'eWallet',
  [ACCOUNT_CATEGORY_ID.OTHER]: 'other',
};

export const ADD_ACCOUNT_DEFAULT_VALUES = {
  accountName: '',
  initialAmount: 0,
  creditCardLimit: 0,
  creditCardIsReminder: false,
  creditCardStatementDay: 5,
  creditCardDayAfterStatement: 15,
  creditCardReminderList: '',
  excludeReport: false,
  isActive: true,
  currency: 'vnd',
  descriptions: '',
};
