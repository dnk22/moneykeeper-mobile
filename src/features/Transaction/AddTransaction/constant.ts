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
  payee: '',
  giver: '',
  fee: 0,
  feeType: '',
  excludeReport: false,
  attachment: '',
  userId: '',
};
export const TransactionContext = createContext<any>(null);
