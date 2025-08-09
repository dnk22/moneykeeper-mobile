import { TRANSACTION_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';
import { SharedStackParamsList } from './shared';
import { NavigationProp, RouteProp } from '@react-navigation/native';

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
} & SharedStackParamsList;

export type TransactionParamListProps<T extends keyof TransactionParamList> = {
  navigation: NavigationProp<TransactionParamList, keyof TransactionParamList>;
  route: RouteProp<TransactionParamList, T>;
};
