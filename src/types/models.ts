import { IconProps } from 'components/SvgIcon/const';

export type TUsers = {
  _id: string;
  user_name: string;
  full_name: string;
  email: string;
  password: string;
  is_premium: boolean;
  created_at: Date;
};

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
  is_add_report?: boolean;
  media?: any;
  created_date: Date;
  user_created?: string;
  user_created_details?: TUsers;
};

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

export type TAccount = {
  name: string;
  initial_amount?: number;
  current_amount?: number;
  account_category: TAccountCategory;
  account_type: string;
  account_type_details: TAccountType;
  provider?: string;
  provider_details?: TProvider;
  currency: string;
  descriptions?: string;
  is_active: boolean;
  is_add_report?: boolean;
  created_date: Date;
};

export type TAccountCategory = 'normal' | 'savings';

export type TAccountType = {
  name: string;
  type: string;
  icon: IconProps;
};

export type TProvider = {
  name: string;
  type: string;
  descriptions: string;
  icon: IconProps;
};
