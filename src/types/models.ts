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
  date_time: Date;
  account_id: string;
  location?: string;
  event?: string;
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
  _id: string;
  name: string;
  initial_amount: number;
  current_amount: number;
  account_type: string;
  account_type_details: TAccountType;
  bank?: string;
  bank_details?: TBank;
  provider?: string;
  provider_details?: TProvider;
  currency?: string;
  descriptions?: string;
  is_active: boolean;
  is_not_add_report?: boolean;
  user_created: string;
  created_date: Date;
};

// account type
export type TAccountType = {
  _id: string;
  name: string;
  value: string;
  shortName?: string;
  icon: IconProps;
};

// provider
export type TProvider = TAccountType;

// bank
export type TBank = TAccountType & {
  icon?: any;
};

export type TLendTransactions = TTransactions & {
  borrower: string;
  collection_date?: Date;
};

export type TBorrowTransactions = TTransactions & {
  lender: string;
  repayment_date?: Date;
};
