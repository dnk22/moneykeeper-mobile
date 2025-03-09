import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BANK_TYPE } from 'utils/constants';
import { ROUTES } from 'navigation/constants/routes';

export type BankParams = {
  [ROUTES.BANK_HOME_LIST]: {
    type: BANK_TYPE;
    returnScreen: string;
  };
};

export type BankParamsProps<T extends keyof BankParams> = NativeStackScreenProps<BankParams, T>;
