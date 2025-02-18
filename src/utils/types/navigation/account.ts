import { ACCOUNTTAB } from 'utils/constants/navigation.constant';
import { CommonStackParamsList } from './common.type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/** account stack navigation */
export type AccountStackParamList = CommonStackParamsList & {
  [ACCOUNTTAB]: undefined;
};

export type AccountStackParamListProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;
