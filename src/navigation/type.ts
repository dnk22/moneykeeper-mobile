import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HOME, ADDWALLET, ACCOUNTTAB } from './constants';

export type RootStackParamList = {
  [HOME]: undefined;
};

export type AccountStackParamList = {
  [ACCOUNTTAB]: undefined;
  [ADDWALLET]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
