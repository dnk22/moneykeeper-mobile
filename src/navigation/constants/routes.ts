export const ROUTES = {
  // Main screen constants
  MAIN: 'main',
  MODAL_STACK: 'modal_stack',

  ONBOARDING: 'onboarding',
  ONBOARDING_TAB: 'onboardingTab',

  // Auth Screen constants
  AUTH: 'auth',
  SIGN_IN: 'login',
  SIGN_UP: 'register',
  FORGOT_PASSWORD: 'forgotPassword',
  RESET_PASSWORD: 'resetPassword',

  // Dashboard screen constants
  DASHBOARD: 'dashboard',
  DASHBOARD_HOME: 'dashboardHome',
  NOTIFICATION: 'notification',

  // Settings screen constants
  SETTINGS: 'settings',
  HOME_SETTINGS: 'home_settings',
  APPEARANCE: 'appearance',

  // Account screen constants
  ACCOUNT: 'account',
  ACCOUNT_TAB: 'accountTab',
  WALLET: 'wallet',
  SAVINGS: 'savings',
  ACCUMULATE: 'accumulate',

  // Transaction screen constants
  TRANSACTIONS: 'transactions',
  ADD_TRANSACTION: 'addTransaction',
  TRANSACTION_CATEGORY: 'transactionCategory',
  TRANSACTION_CATEGORY_TABS: 'transactionCategoryTabs',
  UPDATE_TRANSACTION_CATEGORY: 'updateTransactionCategory',
  PARENT_LIST: 'parentList',
  ICON_SELECT: 'icon_select',
  EXPENSE_CATEGORY: 'expenseCategory',
  INCOME_CATEGORY: 'incomeCategory',
  LEND_BORROW: 'lendBorrow',

  // Report screen constants
  REPORT: 'report',
  HOME_REPORT: 'homeReport',
  EXPENSE_INCOME_REPORT_CURRENT: 'expenseIncomeReportCurrent',
  EXPENSE_INCOME_REPORT_WEEK: 'expenseIncomeReportWeek',
  EXPENSE_INCOME_REPORT_MONTH: 'expenseIncomeReportMonth',
  EXPENSE_INCOME_REPORT_QUART: 'expenseIncomeReportQuart',
  EXPENSE_INCOME_REPORT_YEAR: 'expenseIncomeReportYear',
  EXPENSE_INCOME_REPORT_FREE: 'expenseIncomeReportFree',

  // Bank screen constants
  BANK_NAVIGATION: 'bank',
  BANK_HOME_LIST: 'bankHomeList',

  // Common screen constants
  CREATE_TRANSACTION_FROM_ACCOUNT: 'createTransactionFromAccount',
  ACCOUNT_NORMAL_DETAIL: 'accountNormalDetail',
  ACCOUNT_CREDIT_CARD_DETAIL: 'accountCreditCardDetail',
  ADD_ACCOUNT: 'addAccount',
  EXPENSE_INCOME_DETAIL: 'ExpenseIncomeDetail',
  WIDGET_SETTINGS: 'widgetSettings',
  FINANCE_STATEMENT: 'financeStatement',
  EXPENSE_INCOME_REPORT: 'expenseIncomeReport',
  EXPENSE_INCOME_ANALYZE: 'expenseIncomeAnalyze',
  DEBT_LOAN_REPORT: 'debtLoanReport',
  DEBT_LOAN_REPORT_DETAIL: 'debtLoanReportDetail',
  DEBT: 'debt',
  LOAN: 'loan',
  CONTACT_REPORT: 'contactReport',
} as const;

// export type RouteKeys = keyof typeof ROUTES;
export type ROUTE_KEYS = typeof ROUTES[keyof typeof ROUTES];