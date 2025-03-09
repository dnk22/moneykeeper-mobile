import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { CommonStackParamsList } from './common';

export type ReportParamList = CommonStackParamsList & {
  [ROUTES.HOME_REPORT]: undefined;
  [ROUTES.EXPENSE_INCOME_REPORT]: undefined;
};
export type ReportParamListProps<T extends keyof ReportParamList> = NativeStackScreenProps<
  ReportParamList,
  T
>;
