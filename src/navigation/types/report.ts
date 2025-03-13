import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { SharedStackParamsList } from './shared';

export type ReportParamList = SharedStackParamsList & {
  [ROUTES.HOME_REPORT]: undefined;
  [ROUTES.EXPENSE_INCOME_REPORT]: undefined;
};
export type ReportParamListProps<T extends keyof ReportParamList> = NativeStackScreenProps<
  ReportParamList,
  T
>;
