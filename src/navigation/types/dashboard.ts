import { CommonStackParamsList } from './common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

export type DashboardParamList = CommonStackParamsList & {
  [ROUTES.DASHBOARD_HOME]: undefined;
  [ROUTES.NOTIFICATION]: undefined;
};

export type DashboardStackParamListProps<T extends keyof DashboardParamList> =
  NativeStackScreenProps<DashboardParamList, T>;
