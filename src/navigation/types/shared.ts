import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';

export type SharedStackParamsList = {
  [ROUTES.ADD_ACCOUNT]: {
    accountId?: string;
    bankId?: string;
    toAccountId?: string;
    accountTypeId?: string;
    accountName?: string;
  };
  [ROUTES.FINANCE_STATEMENT]: undefined;
  [ROUTES.EXPENSE_INCOME_DETAIL]: {
    dateView: string;
  };
  [ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT]: {
    transactionId?: string;
    categoryId?: string;
    accountId?: string;
    transactionType?: TRANSACTION_TYPE;
    amount?: number;
    relatedPerson?: string;
  };
  [ROUTES.ACCOUNT_NORMAL_DETAIL]: { accountId: string; accountName: string };
  [ROUTES.ACCOUNT_CREDIT_CARD_DETAIL]: {
    accountId: string;
    accountName: string;
    creditCardLimit: number;
  };
  [ROUTES.DEBT_LOAN_REPORT]: undefined;
  [ROUTES.DEBT_LOAN_REPORT_DETAIL]: { personName: string; type: TRANSACTION_CATEGORY_TYPE };
};
