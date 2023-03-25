import { TTransactionsCategory } from 'database/types/index';
import { TAccountType } from 'database/types';

export enum TRANSACTION_CATEGORY_TYPE {
  EXPENSE,
  INCOME,
  LEND_BORROW,
}

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

export const TransactionTypeData = [
  {
    id: '0',
    name: 'Chi Tiền',
    icon: 'expense',
  },
  {
    id: '1',
    name: 'Thu tiền',
    icon: 'income',
  },
  {
    id: '2',
    name: 'Cho vay',
    icon: 'lend',
  },
  {
    id: '3',
    name: 'Đi vay',
    icon: 'borrowed',
  },
  {
    id: '4',
    name: 'Chuyển khoản',
    icon: 'transfer',
  },
  {
    id: '5',
    name: 'Cân bằng số dư',
    icon: 'adjustment',
  },
];

export const TransactionCategoryData: TTransactionsCategory[] = [
  {
    id: '1',
    categoryName: 'Cho vay',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    parentId: undefined,
    description: '',
    isSystem: true,
    icon: 'lend',
    useCount: 0,
  },
  {
    id: '2',
    categoryName: 'Thu nợ',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    parentId: undefined,
    description: '',
    isSystem: true,
    icon: 'collectDebts',
    useCount: 0,
  },
  {
    id: '3',
    categoryName: 'Đi vay',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    parentId: undefined,
    description: '',
    isSystem: true,
    icon: 'borrow',
    useCount: 0,
  },
  {
    id: '4',
    categoryName: 'Trả nợ',
    categoryType: TRANSACTION_CATEGORY_TYPE.LEND_BORROW,
    parentId: undefined,
    description: '',
    isSystem: true,
    icon: 'repayment',
    useCount: 0,
  },
];
