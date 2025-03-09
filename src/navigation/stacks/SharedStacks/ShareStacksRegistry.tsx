import { CommonStackParamsList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { ScreenRegistry } from './registry';

// Import screens
import AddAccount from 'features/AddAccount';
import TransactionHistoryNormal from 'features/TransactionHistory/NormalAccount';
import TransactionHistoryCreditCard from 'features/TransactionHistory/CreditCardAccount';
import AddTransactions from 'features/AddTransaction';
import ExpenseIncome from 'features/Report/ExpenseIncome';
import FinancialStatement from 'features/Report/FinancialStatement';
import DebtLoanReport from 'features/Report/DebtLoan';
import DebtLoanDetail from 'features/Report/DebtLoan/Detail';

export const sharedScreenRegistry = new ScreenRegistry<CommonStackParamsList>()
  .register(ROUTES.ADD_ACCOUNT, {
    component: AddAccount,
    options: ({ route }) => ({
      title: route.params?.accountId ? 'Sửa tài khoản' : 'Thêm tài khoản',
    }),
  })
  .register(ROUTES.ACCOUNT_NORMAL_DETAIL, {
    component: TransactionHistoryNormal,
    options: ({ route }) => ({
      title: route.params?.accountName,
    }),
  })
  .register(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
    component: TransactionHistoryCreditCard,
    options: ({ route }) => ({
      title: route.params?.accountName,
    }),
  })
  .register(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
    component: AddTransactions,
    options: {
      title: '',
    },
  })
  .register(ROUTES.EXPENSE_INCOME_DETAIL, {
    component: ExpenseIncome,
    options: ({ route: { params } }) => ({
      title: `Chi tiêu ${params.dateView.toLowerCase()}`,
    }),
  })
  .register(ROUTES.FINANCE_STATEMENT, {
    component: FinancialStatement,
    options: {
      title: 'Báo cáo tài chính',
    },
  })
  .register(ROUTES.DEBT_LOAN_REPORT, {
    component: DebtLoanReport,
    options: {
      title: 'Báo cáo vay nợ',
    },
  })
  .register(ROUTES.DEBT_LOAN_REPORT_DETAIL, {
    component: DebtLoanDetail,
    options: ({ route: { params } }) => ({
      title: params.personName,
    }),
  });
