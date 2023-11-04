import { createContext } from 'react';

export let defaultValues = {
  amount: 0,
  dateTimeAt: new Date(),
  categoryId: '',
  accountId: '',
  descriptions: '',
  location: '',
  eventName: '',
  payFor: '',
  relatedPerson: '',
  fee: 0,
  feeType: '',
  isNotAddReport: false,
  attachment: '',
  userId: '',
};
export const TransactionContext = createContext<any>(null);
