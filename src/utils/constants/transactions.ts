import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
import { TTransactionType } from 'utils/types/request.type';

export const TRANSACTION_TYPE_DATA: TTransactionType[] = [
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
