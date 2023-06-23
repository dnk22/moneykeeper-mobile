import { TRANSACTION_TYPE } from 'utils/constant';

export let defaultValues = {
  amount: '0',
  dateTimeAt: new Date(),
  transactionsCategoryId: '',
  transactionsTypeId: TRANSACTION_TYPE.EXPENSE,
  accountId: '',
  descriptions: '',
  location: '',
  eventName: '',
  payFor: '',
  relatedPerson: '',
  fee: '',
  feeType: '',
  isNotAddReport: false,
  attachment: '',
  userId: '',
};
