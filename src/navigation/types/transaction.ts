import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRANSACTION_TYPE } from 'utils/constants';
import { ADD_TRANSACTION } from 'utils/constants/navigation.constant';

/** transaction stack navigation */
export type TransactionParamList = {
  [ADD_TRANSACTION]: {
    transactionId?: string;
    categoryId?: string;
    accountId?: string;
    transactionType?: TRANSACTION_TYPE;
    amount?: number;
    relatedPerson?: string;
  };
};

export type TransactionParamListProps<T extends keyof TransactionParamList> =
  NativeStackScreenProps<TransactionParamList, T>;
