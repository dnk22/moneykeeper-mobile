import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { BANK_TYPE } from 'utils/constants/account';

export type BankStackParamList = {
  [ROUTES.BANK_HOME_LIST]: {
    type: BANK_TYPE;
    returnScreen: string;
  };
};

export type BankStackNavigationProps = NativeStackScreenProps<
  BankStackParamList,
  keyof BankStackParamList
>['navigation'];

export type BankStackRouteProps<T extends keyof BankStackParamList> = NativeStackScreenProps<
  BankStackParamList,
  T
>['route'];
