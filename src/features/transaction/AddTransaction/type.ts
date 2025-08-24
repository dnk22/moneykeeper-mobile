import { TRANSACTION_TYPE } from 'utils/constants';

export type TransactionTypeProps = {
  params: {
    transactionId?: string;
    transactionType: TRANSACTION_TYPE;
    categoryId?: string;
    accountId?: string;
  };
};

export type AddTransactionType = {
  onDelete: () => void;
  onSubmitSuccess: () => void;
};
