import { BANK_TYPE, TRANSACTION_TYPE } from 'utils/constant';

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TResponse = {
  success: boolean;
  message?: unknown;
  data?: unknown;
};
export type TSearchBankParams = {
  type: BANK_TYPE;
  text?: string;
};

export type TTransactionType = {
  id: string;
  value: TRANSACTION_TYPE;
  name: string;
  icon: string;
  categoryType?: string;
};
