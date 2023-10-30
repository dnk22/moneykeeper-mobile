import { TTransactionsCategory } from 'database/types';
import { TAccountType } from 'database/types';
import {
  ACCOUNT_CATEGORY_ID,
  TRANSACTION_CATEGORY_TYPE,
  TRANSACTION_LEND_BORROW_NAME,
  TRANSACTION_TYPE,
} from 'utils/constant';
import { TTransactionType } from 'utils/types';

export const TransactionTypeData: TTransactionType[] = [
  {
    id: '0',
    value: TRANSACTION_TYPE.EXPENSE,
    name: 'Chi Tiền',
    icon: 'expenseType',
  },
  {
    id: '1',
    value: TRANSACTION_TYPE.INCOME,
    name: 'Thu tiền',
    icon: 'incomeType',
  },
  {
    id: '2',
    value: TRANSACTION_TYPE.EXPENSE,
    name: 'Cho vay',
    icon: 'lend',
    categoryType: TRANSACTION_LEND_BORROW_NAME.LEND,
  },
  {
    id: '3',
    value: TRANSACTION_TYPE.INCOME,
    name: 'Đi vay',
    icon: 'borrowed',
    categoryType: TRANSACTION_LEND_BORROW_NAME.BORROW,
  },
  {
    id: '4',
    value: TRANSACTION_TYPE.TRANSFER,
    name: 'Chuyển khoản',
    icon: 'transfer',
  },
  {
    id: '5',
    value: TRANSACTION_TYPE.ADJUSTMENT,
    name: 'Cân bằng số dư',
    icon: 'adjustment',
  },
];

export const AccountType: TAccountType[] = [
  {
    id: ACCOUNT_CATEGORY_ID.MONEY,
    name: 'Tiền mặt',
    value: 'cash',
    icon: 'cash',
  },
  {
    id: ACCOUNT_CATEGORY_ID.BANK,
    name: 'Tài khoản ngân hàng',
    value: 'bank',
    icon: 'bank',
  },
  {
    id: ACCOUNT_CATEGORY_ID.CREDITCARD,
    name: 'Thẻ tín dụng',
    value: 'credit',
    icon: 'credit',
  },
  {
    id: ACCOUNT_CATEGORY_ID.INVESTMENT,
    name: 'Tài khoản đầu tư',
    value: 'investment',
    icon: 'investment',
  },
  {
    id: ACCOUNT_CATEGORY_ID.EWALLET,
    name: 'Ví điện tử',
    value: 'eWallet',
    icon: 'eWallet',
  },
  {
    id: ACCOUNT_CATEGORY_ID.OTHER,
    name: 'Khác',
    value: 'other',
    icon: 'money',
  },
];

export const TransactionCategoryData: TTransactionsCategory[] = [
  {
    categoryName: TRANSACTION_LEND_BORROW_NAME.BORROW,
    categoryType: TRANSACTION_CATEGORY_TYPE.INCOME,
    parentId: '',
    description: '',
    isSystem: true,
    icon: 'borrow',
    useCount: 0,
  },
  {
    categoryName: TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
    categoryType: TRANSACTION_CATEGORY_TYPE.EXPENSE,
    parentId: '',
    description: '',
    isSystem: true,
    icon: 'repayment',
    useCount: 0,
  },
  {
    categoryName: TRANSACTION_LEND_BORROW_NAME.LEND,
    categoryType: TRANSACTION_CATEGORY_TYPE.EXPENSE,
    parentId: '',
    description: '',
    isSystem: true,
    icon: 'lend',
    useCount: 0,
  },
  {
    categoryName: TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS,
    categoryType: TRANSACTION_CATEGORY_TYPE.INCOME,
    parentId: '',
    description: '',
    isSystem: true,
    icon: 'collectDebts',
    useCount: 0,
  },
];
