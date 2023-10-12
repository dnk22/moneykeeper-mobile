import { TTransactions } from 'database/types';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';

export type TransactionTypeProps = {
  params: {
    transactionId?: string;
    transactionType: TRANSACTION_TYPE;
    categoryId?: string;
    accountId?: string;
  };
};

export type AddTransactionType = {
  params: {
    transactionId?: string;
    transactionType: TRANSACTION_TYPE;
    categoryId?: string;
    accountId?: string;
  };
  handleSubmit: UseFormHandleSubmit<TTransactions, undefined>;
  setValue: UseFormSetValue<TTransactions>;
  watch: UseFormWatch<TTransactions>;
  reset: UseFormReset<TTransactions>;
  errors: FieldErrors<TTransactions>;
};

export type CategoryProp = {
  icon: string;
  categoryName: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  value: string;
};
