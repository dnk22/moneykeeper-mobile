import { EXPENSE_INCOME_REPORT, HOME_REPORT } from 'utils/constants/navigation.constant';
import { CommonStackParamsList } from './common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ReportParamList = CommonStackParamsList & {
  [HOME_REPORT]: undefined;
  [EXPENSE_INCOME_REPORT]: undefined;
};
export type ReportParamListProps<T extends keyof ReportParamList> = NativeStackScreenProps<
  ReportParamList,
  T
>;
