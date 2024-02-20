export type WidgetOrderListProps = {
  label: string;
  key: string;
  isActive: boolean;
};

export const WIDGET_IMPORT_LIST = {
  expenseAndIncome: require('./Widgets/ExpenseAndIncome'),
  wallets: require('./Widgets/Wallets'),
  history: require('./Widgets/RecentTransactions'),
};

export const WIDGET_INIT_LIST = [
  {
    label: 'Tổng quát chi tiêu',
    key: 'expenseAndIncome',
    isActive: true,
  },
  {
    label: 'Ví của bạn',
    key: 'wallets',
    isActive: true,
  },
  {
    label: 'Lịch sử ghi chép',
    key: 'history',
    isActive: true,
  },
];
