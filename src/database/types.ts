import { IconProps } from 'components/SvgIcon/const';
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY_TYPE, ACCOUNT_CATEGORY_ID } from 'utils/constant';

// user
export type TUsers = {
  id: string;
  user_name: string;
  full_name: string;
  email: string;
  password: string;
  is_premium: boolean;
  created_at: Date;
};

// transactions
export type TTransactions = {
  id: string;
  amount: number;
  toAmount: number;
  transactionType: TRANSACTION_TYPE;
  closingAmount: number;
  categoryIcon?: any;
  categoryId: string;
  categoryName?: string;
  descriptions?: string;
  dateTimeAt: number;
  accountId: string;
  toAccountId: string;
  accountName?: string;
  location?: string;
  eventName?: string;
  payFor?: string;
  relatedPerson?: string;
  giver?: string;
  payee?: string;
  fee?: number;
  feeType?: string;
  excludeReport?: boolean;
  attachment?: any;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TTransactionsCategory = {
  id: string;
  categoryName: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  parentId: string;
  description: string;
  isSystem: boolean;
  icon: string;
  useCount: number;
  sortOrder: number;
  lastUseAt?: Date | null;
  dictionaryKey: number;
  children?: TTransactionsCategory[];
};

// account
export type TAccount = {
  id?: string;
  accountName: string;
  initialAmount: number;
  accountTypeId: number;
  accountTypeName: string;
  closingAmount?: number;
  bankId?: string;
  currency?: string;
  descriptions?: string;
  isActive: boolean;
  excludeReport?: boolean;
  userId: string;
  accountLogo: string;
  sortOrder: number;
  termType?: number;
  termMonth?: number;
  interestRate?: number;
  interestPaymentType?: number;
  dueType?: number;
  startDate?: Date;
  endDate?: Date;
  interestPaymentToAccount?: string;
  savingFromAccountId?: string;
  numberDayOfYear?: number;

  // credit card
  creditCardLimit: number;
  creditCardIsReminder: boolean;
  creditCardReminderList?: string;
  creditCardStatementDay: number;
  creditCardDayAfterStatement: number;

  createdAt?: Date;
  updatedAt?: Date;
};

// account type
export type TAccountType = {
  id: ACCOUNT_CATEGORY_ID;
  name: string;
  value: string;
  icon: IconProps | any;
};

export type TBank = {
  id: string;
  bankCode: string;
  bankName: string;
  shortName?: string;
  icon: string;
  isSystem: boolean;
  isWallet?: boolean;
};

export type TContact = {
  id: string;
  contactName: string;
};

export type TBalance = {
  transactionId?: string;
  accountId?: string;
  openAmount?: number;
  movementAmount?: number;
  closingAmount?: number;
  transactionDateAt: Date | null;
};
