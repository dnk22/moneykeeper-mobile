import { APPEARANCE, HOME_SETTINGS } from 'utils/constants/navigation.constant';
import { CommonStackParamsList } from './common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type SettingsParamList = CommonStackParamsList & {
  [HOME_SETTINGS]: undefined;
  [APPEARANCE]: undefined;
};
export type SettingsParamListProps<T extends keyof SettingsParamList> = NativeStackScreenProps<
  SettingsParamList,
  T
>;
