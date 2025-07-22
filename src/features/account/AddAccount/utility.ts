import { TAccount } from 'database/types';
import { ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import { formatNumberGroups } from 'utils/math';

export const formatDataBeforeSubmit = (data: TAccount) => ({
  ...data,
  initialAmount: +String(data.initialAmount).replace(/,/g, '') || 0,
  creditCardReminderList: data.creditCardReminderList || '',
});

export const formatDataDetail = (data: TAccount) => ({
  ...data,
  initialAmount: formatNumberGroups(String(data.initialAmount)),
  accountTypeId: data.accountTypeId || ACCOUNT_TYPE_LIST[0].id,
});
