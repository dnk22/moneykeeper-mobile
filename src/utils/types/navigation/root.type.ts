import { NavigatorScreenParams } from '@react-navigation/native';
import { HomeStackParamList } from './home.type';
import { BankParams } from './bank.type';
import { TransactionCategoryParams } from './transactionCategory.type';
import {
  APPEARANCE,
  WIDGET_SETTINGS,
  HOME,
  BANK_NAVIGATION,
  TRANSACTION_CATEGORY,
} from 'utils/constants/navigation.constant';

export type RootStackParamList = {
  [HOME]: NavigatorScreenParams<HomeStackParamList>;
  [BANK_NAVIGATION]: NavigatorScreenParams<BankParams>;
  [TRANSACTION_CATEGORY]: NavigatorScreenParams<TransactionCategoryParams>;
  [APPEARANCE]: undefined;
  [WIDGET_SETTINGS]: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
