import { TTransactions } from 'database/types';
import { formatNumberGroups } from 'utils/math';

export const formatDataDetail = (data: TTransactions) => ({
  ...data,
  amount: formatNumberGroups(String(Math.abs(+data.amount))),
});
