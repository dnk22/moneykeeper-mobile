import { TAccountType } from 'database/types';

export enum ACCOUNT_CATEGORY_ID {
  MONEY,
  BANK,
  CREDITCARD,
  INVESTMENT,
  EWALLET,
}

export enum BANK_TYPE {
  BANK,
  WALLET,
  INVESTMENT,
}

export const ACCOUNT_TYPE_ALL = {
  id: -1,
  name: 'Tất cả',
  icon: '',
};

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
];

export const DEFAULT_ACCOUNT_TYPE = ACCOUNT_TYPE_LIST[0];

export const getAccountTypeById = (accountTypeId?: number | null): TAccountType =>
  ACCOUNT_TYPE_LIST.find((item) => item.id === accountTypeId) ?? DEFAULT_ACCOUNT_TYPE;

export const ADD_ACCOUNT_DEFAULT_VALUES = {
  accountName: '',
  initialAmount: 0,
  isCCReminder: false,
  accountLogo: DEFAULT_ACCOUNT_TYPE.icon,
  accountTypeId: DEFAULT_ACCOUNT_TYPE.id,
  creditCardStatementDay: 5,
  creditCardDayAfterStatement: 15,
  creditCardReminderList: '',
  excludeReport: false,
  isActive: true,
  currency: 'vnd',
  descriptions: '',
};
