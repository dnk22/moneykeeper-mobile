import { CommonStackParamsList } from './common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';

export type SettingsParamList = CommonStackParamsList & {
  [ROUTES.HOME_SETTINGS]: undefined;
  [ROUTES.APPEARANCE]: undefined;
};
export type SettingsParamListProps<T extends keyof SettingsParamList> = NativeStackScreenProps<
  SettingsParamList,
  T
>;
