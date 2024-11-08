import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';

export type TGetDebtLoanDetailByPerson = {
  id: string;
  categoryType: TRANSACTION_CATEGORY_TYPE;
  categoryName: string;
  icon: string;
  descriptions: string;
  amount: number;
  dateTimeAt: number;
  accountLogo: string;
  accountName: string;
};
