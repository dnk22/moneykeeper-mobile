import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

import { BankParams } from './bank';
import { TransactionCategoryParams } from './transactionCategory';

export type ModalStackParamList = {
  [ROUTES.BANK_NAVIGATION]: NavigatorScreenParams<BankParams>;
  [ROUTES.TRANSACTION_CATEGORY]: NavigatorScreenParams<TransactionCategoryParams>;
  [ROUTES.WIDGET_SETTINGS]: undefined;
};

export type ModalStackParamsProps<T extends keyof ModalStackParamList> = NativeStackScreenProps<
  ModalStackParamList,
  T
>;
