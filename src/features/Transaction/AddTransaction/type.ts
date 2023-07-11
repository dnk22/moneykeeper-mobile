import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';

export type TransactionTypeProps = {
  params: {
    transactionId?: string;
    transactionType: TRANSACTION_TYPE;
    categoryId?: string;
    accountId?: string;
  };
};

export type CategoryProp = {
  icon: string;
  categoryName: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  value: string;
};
