import { DASHBOARDHOME, NOTIFICATION } from 'utils/constants/navigation.constant';
import { CommonStackParamsList } from './common.type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type DashboardParamList = CommonStackParamsList & {
  [DASHBOARDHOME]: undefined;
  [NOTIFICATION]: undefined;
};

export type DashboardStackParamListProps<T extends keyof DashboardParamList> =
  NativeStackScreenProps<DashboardParamList, T>;
