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

// don't suffer order
export const ACCOUNT_TYPE_LIST: TAccountType[] = [
  {
    id: ACCOUNT_CATEGORY_ID.MONEY,
    name: 'Tiền mặt',
    icon: 'cash',
  },
  {
    id: ACCOUNT_CATEGORY_ID.BANK,
    name: 'Tài khoản ngân hàng',
    icon: 'bank',
  },
  {
    id: ACCOUNT_CATEGORY_ID.CREDITCARD,
    name: 'Thẻ tín dụng',
    icon: 'creditCard',
  },
  {
    id: ACCOUNT_CATEGORY_ID.INVESTMENT,
    name: 'Tài khoản đầu tư',
    icon: 'investment',
  },
  {
    id: ACCOUNT_CATEGORY_ID.EWALLET,
    name: 'Ví điện tử',
    icon: 'eWallet',
  },
  {
    id: ACCOUNT_CATEGORY_ID.OTHER,
    name: 'Khác',
    icon: 'money',
  },
];

export const ADD_ACCOUNT_DEFAULT_VALUES = {
  accountName: '',
  initialAmount: 0,
  isCCReminder: false,
  accountLogo: ACCOUNT_TYPE_LIST[0].icon,
  accountTypeId: ACCOUNT_TYPE_LIST[0].id,
  creditCardStatementDay: 5,
  creditCardDayAfterStatement: 15,
  creditCardReminderList: '',
  excludeReport: false,
  isActive: true,
  currency: 'vnd',
  descriptions: '',
};
