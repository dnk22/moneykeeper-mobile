import { TRANSACTION_TYPE } from 'utils/constants';

export const defaultValues = {
  amount: 0,
  toAmount: 0,
  recordAt: new Date(),
  closingAmount: 0,
  categoryId: '',
  accountId: '',
  descriptions: '',
  location: '',
  eventName: '',
  payFor: '',
  relatedPerson: '',
  payee: '',
  giver: '',
  fee: 0,
  feeType: '',
  excludeReport: 0,
  attachment: '',
  userId: '',
};

export const INPUT_AMOUNT_COLOR: any = {
  [TRANSACTION_TYPE.INCOME]: 'green',
  [TRANSACTION_TYPE.TRANSFER]: 'red',
  [TRANSACTION_TYPE.EXPENSE]: 'green',
  [TRANSACTION_TYPE.ADJUSTMENT]: 'red',
};
