import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from 'navigation/constants/routes';
import { BANK_TYPE } from 'utils/constants/account';

export type BankParams = {
  [ROUTES.BANK_HOME_LIST]: {
    type: BANK_TYPE;
    returnScreen: string;
  };
};

export type BankParamsProps<T extends keyof BankParams> = NativeStackScreenProps<BankParams, T>;
