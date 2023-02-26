import { IconProps } from 'components/SvgIcon/const';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

// user
export type TUsers = {
  _id: string;
  user_name: string;
  full_name: string;
  email: string;
  password: string;
  is_premium: boolean;
  created_at: Date;
};

// transactions
export type TTransactions = {
  _id: string;
  amount: number;
  transactions_type_id: string;
  transactions_type_details?: TTransactionType;
  transactions_category_id: string;
  descriptions?: string;
  date_time_at: Date;
  account_id: string;
  location?: string;
  event_name?: string;
  pay_for?: string;
  fee?: number;
  fee_type?: string;
  is_not_add_report?: boolean;
  media?: any;
  user_id?: string;
};

export type TTransactionsCategory = {
  _id: string;
  category_name: string;
  parent?: string;
  category_description: string;
  category_type: TRANSACTION_CATEGORY_TYPE;
  count: number;
  icon: string;
};

export type TTransactionType = {
  _id: string;
  name: string;
  type: string;
  icon: IconProps;
};

// account
export type TAccount = {
  id: string;
  accountName: string;
  initialAmount: number;
  currentAmount: number;
  accountTypeId: string;
  bankId?: string;
  currency?: string;
  descriptions?: string;
  isActive: boolean;
  isNotAddReport?: boolean;
  userId: string;
  accountIcon: string;
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
  createdAt: Date;
  updatedAt: Date;
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
