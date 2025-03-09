import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BANK_TYPE } from 'utils/constants';
import { BANK_HOME_LIST } from 'utils/constants/navigation.constant';

export type BankParams = {
  [BANK_HOME_LIST]: {
    type: BANK_TYPE;
    returnScreen: string;
  };
};

export type BankParamsProps<T extends keyof BankParams> = NativeStackScreenProps<BankParams, T>;
