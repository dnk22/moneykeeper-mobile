import { TTransactions } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constants';

export const formatDataBeforeSubmit = (data: TTransactions) => ({
  ...data,
  excludeReport: data?.excludeReport,
  amount:
    data.transactionType === TRANSACTION_TYPE.INCOME
      ? Math.abs(+String(data.amount).replace(/,/g, '') || 0)
      : -Math.abs(+String(data.amount).replace(/,/g, '') || 0),
});
