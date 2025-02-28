import { BANK_TYPE, TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constants';

//common

export type TResponse = {
  success: boolean;
  message?: unknown;
  data?: unknown;
};

export type TGetDebtLoanDetailByPerson = {
  id: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  categoryName: string;
  icon: string;
  descriptions: string;
  amount: number;
  dateTimeAt: number;
  accountLogo: string;
  accountName: string;
};

//bank
export type TSearchBankParams = {
  type?: BANK_TYPE;
  text?: string;
};

// transaction
export type TTransactionType = {
  id: string;
  value: TRANSACTION_TYPE;
  name: string;
  icon: string;
  categoryType?: TRANSACTION_CATEGORY_TYPE;
};
