import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRANSACTION_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';

/** transaction stack navigation */
export type TransactionParamList = {
  [ROUTES.ADD_TRANSACTION]: {
    transactionId?: string;
    categoryId?: string;
    accountId?: string;
    transactionType?: TRANSACTION_TYPE;
    amount?: number;
    relatedPerson?: string;
  };
};

export type TransactionParamListProps<T extends keyof TransactionParamList> = {
  navigation: NativeStackScreenProps<TransactionParamList, T>['navigation'];
  route: NativeStackScreenProps<TransactionParamList, T>['route'];
};
