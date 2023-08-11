import { TTransactionsCategory } from 'database/types/index';
import { TAccountType } from 'database/types';
import {
  BORROW,
  COLLECT_DEBTS,
  LEND,
  REPAYMENT,
  TRANSACTION_CATEGORY_TYPE,
  TRANSACTION_TYPE,
} from 'utils/constant';

export const TransactionTypeData = [
  {
    id: TRANSACTION_TYPE.EXPENSE,
    name: 'Chi Tiền',
    icon: 'expenseType',
  },
  {
    id: TRANSACTION_TYPE.INCOME,
    name: 'Thu tiền',
    icon: 'incomeType',
  },
  {
    id: TRANSACTION_TYPE.LEND,
    name: 'Cho vay',
    icon: 'lend',
  },
  {
    id: TRANSACTION_TYPE.BORROW,
    name: 'Đi vay',
    icon: 'borrowed',
  },
  {
    id: TRANSACTION_TYPE.TRANSFER,
    name: 'Chuyển khoản',
    icon: 'transfer',
  },
  {
    id: TRANSACTION_TYPE.ADJUSTMENT,
    name: 'Cân bằng số dư',
    icon: 'adjustment',
  },
];

export const Account_Type: TAccountType[] = [
  {
    id: '0',
    name: 'Tiền mặt',
    value: 'cash',
    icon: 'cash',
  },
  {
    id: '1',
    name: 'Tài khoản ngân hàng',
    value: 'bank',
    icon: 'bank',
  },
  {
    id: '2',
    name: 'Thẻ tín dụng',
    value: 'credit',
    icon: 'credit',
  },
  {
    id: '3',
    name: 'Tài khoản đầu tư',
    value: 'investment',
    icon: 'investment',
  },
  {
    id: '4',
    name: 'Ví điện tử',
    value: 'eWallet',
    icon: 'eWallet',
  },
  {
    id: '5',
    name: 'Khác',
    value: 'other',
    icon: 'money',
  },
];

export const TransactionCategoryData: TTransactionsCategory[] = [
  {
    id: '1',
    categoryName: 'Đi vay',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    value: BORROW,
    parentId: null,
    description: '',
    isSystem: true,
    icon: 'borrow',
    useCount: 0,
  },
  {
    id: '2',
    categoryName: 'Trả nợ',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    value: REPAYMENT,
    parentId: null,
    description: '',
    isSystem: true,
    icon: 'repayment',
    useCount: 0,
  },
  {
    id: '3',
    categoryName: 'Cho vay',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    value: LEND,
    parentId: null,
    description: '',
    isSystem: true,
    icon: 'lend',
    useCount: 0,
  },
  {
    id: '4',
    categoryName: 'Thu nợ',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    value: COLLECT_DEBTS,
    parentId: null,
    description: '',
    isSystem: true,
    icon: 'collectDebts',
    useCount: 0,
  },
];
