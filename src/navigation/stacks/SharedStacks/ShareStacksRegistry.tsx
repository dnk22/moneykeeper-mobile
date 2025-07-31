import { SharedStackParamsList, SharedStackParamsListProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { ScreenRegistry } from './registry';

// Import screens
import AddAccount from 'features/account/AddAccount';
import TransactionHistoryNormal from 'features/transaction/TransactionHistory/NormalAccount';
import TransactionHistoryCreditCard from 'features/transaction/TransactionHistory/CreditCardAccount';
import AddTransactions from 'features/transaction/AddTransaction';
import ExpenseIncome from 'features/Report/ExpenseIncome';
import FinancialStatement from 'features/Report/FinancialStatement';
import DebtLoanReport from 'features/Report/DebtLoan';
import DebtLoanDetail from 'features/Report/DebtLoan/Detail';
import BankNavigation from '../BankStack';
import TransactionCategoryNavigation from '../TransactionCategoryStack';

export const sharedScreenRegistry = new ScreenRegistry<SharedStackParamsList>()
  .register(ROUTES.ADD_ACCOUNT, {
    component: AddAccount,
    options: ({
      route,
    }: {
      route: SharedStackParamsListProps<typeof ROUTES.ADD_ACCOUNT>['route'];
    }) => ({
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
  })
  //modal stack
  .register(ROUTES.BANK_NAVIGATION, {
    component: BankNavigation,
    options: () => ({
      headerShown: false,
      presentation: 'modal',
    }),
  })
  .register(ROUTES.TRANSACTION_CATEGORY, {
    component: TransactionCategoryNavigation,
    options: () => ({
      headerShown: false,
      presentation: 'modal',
    }),
  });
