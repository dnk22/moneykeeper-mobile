import { TTransactions } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constants';
import { formatNumberGroups } from 'utils/math';

export const formatDataBeforeSubmit = (data: TTransactions) => ({
  ...data,
  excludeReport: data?.excludeReport,
  amount:
    data.transactionType === TRANSACTION_TYPE.INCOME
      ? Math.abs(+String(data.amount).replace(/,/g, '') || 0)
      : -Math.abs(+String(data.amount).replace(/,/g, '') || 0),
});

export const formatDataDetail = (data: TTransactions) => ({
  ...data,
  amount: formatNumberGroups(String(Math.abs(data.amount))),
});
