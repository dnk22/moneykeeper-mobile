import { TRANSACTION_TYPE } from 'utils/constant';

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
    categoryId?: string;
    accountId?: string;
  };
  onSubmitSuccess: () => void;
};
