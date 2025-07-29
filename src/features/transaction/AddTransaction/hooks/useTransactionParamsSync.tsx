import { useEffect } from 'react';
import { TransactionParamList } from 'navigation/types';

interface Props {
  params: Partial<TransactionParamList['ADD_TRANSACTION']>;
  navigation: any;
  getValues: (name: string) => any;
  setValue: any;
}

export const useTransactionParamsSync = ({ params, navigation, getValues, setValue }: Props) => {
  useEffect(() => {
    if (params?.transactionType) {
      setValue('transactionType', params.transactionType);
    }
  }, [params?.transactionType]);

  useEffect(() => {
    if (params?.accountId) {
      setValue('accountId', params.accountId);
    }
  }, [params?.accountId]);

  useEffect(() => {
    if (params?.categoryId && params?.categoryId !== getValues('categoryId')) {
      setValue('categoryId', params.categoryId);
      navigation.setParams({ categoryId: undefined });
    }
  }, [params?.categoryId]);

  useEffect(() => {
    if (params?.relatedPerson) {
      setValue('relatedPerson', params.relatedPerson);
      navigation.setParams({ relatedPerson: undefined });
    }
  }, [params?.relatedPerson]);
};
