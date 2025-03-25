import { TAccount } from 'database/types';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';

export const formatAccountData = (data: TAccount) => ({
  ...data,
  initialAmount: data.accountTypeId !== ACCOUNT_CATEGORY_ID.CREDITCARD ? +data?.initialAmount : 0,
  creditCardReminderList: data.creditCardIsReminder ? data.creditCardReminderList : '',
});
