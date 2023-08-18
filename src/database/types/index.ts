import { IconProps } from 'components/SvgIcon/const';
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

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
  transactionType?: TRANSACTION_TYPE;
  categoryId?: string;
  descriptions?: string;
  dateTimeAt: Date;
  accountId: string;
  toAccountId: string;
  location?: string;
  eventName?: string;
  payFor?: string;
  relatedPerson?: string;
  fee?: number;
  feeType?: string;
  isNotAddReport?: boolean;
  attachment?: any;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TTransactionsCategory = {
  id: string;
  categoryName: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  value?: string;
  parentId: string | null;
  description?: string;
  isSystem: boolean;
  icon?: string;
  useCount: number;
};

export type TTransactionType = {
  id: TRANSACTION_TYPE;
  name: string;
  icon: string;
};

// account
export type TAccount = {
  id: string;
  accountName: string;
  initialAmount: number;
  currentAmount: number;
  accountTypeId: string;
  accountTypeName: string;
  bankId?: string;
  currency?: string;
  descriptions?: string;
  isActive: boolean;
  isNotAddReport?: boolean;
  userId: string;
  accountLogo: string;
  sortOrder?: number;
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
  creditCardLimit?: number;
  creditCardIsReminder?: boolean;
  creditCardReminderList?: string;
  creditCardPaymentDay?: number;
  creditCardStatementDay?: number;
  creditCardDayAfterStatement?: number;

  createdAt?: Date;
  updatedAt?: Date;
};

// account type
export type TAccountType = {
  id: string;
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
