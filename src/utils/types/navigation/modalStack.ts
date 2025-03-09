import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BANK_NAVIGATION,
  TRANSACTION_CATEGORY,
  WIDGET_SETTINGS,
} from 'utils/constants/navigation.constant';
import { BankParams } from './bank';
import { TransactionCategoryParams } from './transactionCategory';

export type ModalStackParamList = {
  [BANK_NAVIGATION]: NavigatorScreenParams<BankParams>;
  [TRANSACTION_CATEGORY]: NavigatorScreenParams<TransactionCategoryParams>;
  [WIDGET_SETTINGS]: undefined;
};

export type BankParamsProps<T extends keyof ModalStackParamList> = NativeStackScreenProps<
  ModalStackParamList,
  T
>;
