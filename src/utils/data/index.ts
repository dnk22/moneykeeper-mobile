import { Account_Type, BankDefaultData } from './account.default';

export enum TRANSACTION_CATEGORY_TYPE {
  EXPENSE,
  INCOME,
  LEND_BORROW,
}

export { Account_Type, BankDefaultData };

export const TransactionTypeData = [
  {
    id: '0',
    name: 'Chi Tiền',
    type: 'expense',
    icon: require('assets/images/transaction_type/expense.png'),
  },
  {
    id: '1',
    name: 'Thu tiền',
    type: 'income',
    icon: require('assets/images/transaction_type/income.png'),
  },
  {
    id: '2',
    name: 'Cho vay',
    type: 'lend',
    icon: require('assets/images/transaction_type/lend.png'),
  },
  {
    id: '3',
    name: 'Đi vay',
    type: 'borrow',
    icon: require('assets/images/transaction_type/borrowed.png'),
  },
  {
    id: '4',
    name: 'Chuyển khoản',
    type: 'transfer',
    icon: require('assets/images/transaction_type/transfer.png'),
  },
  {
    id: '5',
    name: 'Cân bằng số dư',
    type: 'adjustment',
    icon: require('assets/images/transaction_type/adjustment.png'),
  },
];
