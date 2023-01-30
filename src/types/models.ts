import { IconProps } from 'components/SvgIcon/const';

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
  amount?: number;
  transactions_category?: string;
  transactions_category_details?: TTransactionsCategory;
  transactions_type?: string;
  transactions_type_details?: TTransactionType;
  descriptions?: string;
  date_time: Date;
  account?: string;
  account_details?: TAccount;
  location?: string;
  event?: string;
  pay_for?: string;
  fee?: number;
  fee_type?: string;
  is_not_add_report?: boolean;
  media?: any;
  created_date: Date;
  user_created?: string;
  user_created_details?: TUsers;
};

// account
export type TAccount = {
  _id: string;
  name: string;
  initial_amount?: number;
  current_amount?: number;
  account_type: string;
  bank?: string;
  provider?: string;
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
export type TBank = TAccountType;

export type TTransactionsCategory = {
  _id: string;
  category_name: string;
  parent?: string;
  category_description: string;
  category_type: string;
  category_group: string;
  icon: IconProps;
};

export type TTransactionType = {
  _id: string;
  name: string;
  type: string;
  icon: string;
};

export type TLendTransactions = TTransactions & {
  borrower: string;
  collection_date?: Date;
};

export type TBorrowTransactions = TTransactions & {
  lender: string;
  repayment_date?: Date;
};
