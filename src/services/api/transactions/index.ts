import { addNewTransaction, updateTransactionById } from 'database/querying';
import { TTransactions } from 'database/types';

type transactionRequestUpdateProp = {
  id?: string;
  data: TTransactions;
};

export const updateTransaction = async ({ id, data }: transactionRequestUpdateProp) => {
  try {
    if (!id) {
      await addNewTransaction(data);
    } else {
      await updateTransactionById({ id, data });
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};
