import {
  ADD_ACCOUNT,
  ACCOUNT_NORMAL_DETAIL,
  ACCOUNT_CREDIT_CARD_DETAIL,
  EXPENSE_INCOME_DETAIL,
  FINANCE_STATEMENT,
  DEBT_LOAN_REPORT_DETAIL,
  CREATE_TRANSACTION_FROM_ACCOUNT,
} from 'utils/constants/navigation.constant';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constants';

export type CommonStackParamsList = {
  [ADD_ACCOUNT]: {
    accountId?: string;
    bankId?: string;
    toAccountId?: string;
  };
  [FINANCE_STATEMENT]: undefined;
  [EXPENSE_INCOME_DETAIL]: {
    dateView: string;
  };
  [CREATE_TRANSACTION_FROM_ACCOUNT]: {
    transactionId?: string;
    categoryId?: string;
    accountId?: string;
    transactionType?: TRANSACTION_TYPE;
    amount?: number;
    relatedPerson?: string;
  };
  [ACCOUNT_NORMAL_DETAIL]: { accountId: string; accountName: string };
  [ACCOUNT_CREDIT_CARD_DETAIL]: { accountId: string; accountName: string; creditCardLimit: number };
  [DEBT_LOAN_REPORT_DETAIL]: { personName: string; type: TRANSACTION_CATEGORY_TYPE };
};
