import { ACCOUNT_CATEGORY_ID, TRANSACTION_CATEGORY_TYPE } from 'utils/constants';

export type dataLevelProps = {
  id?: string;
  categoryType?: TRANSACTION_CATEGORY_TYPE;
  accountName?: string;
  accountTypeId?: ACCOUNT_CATEGORY_ID;
  categoryName?: string;
  accountTypeName?: string;
  relatedPerson?: string;
  value: number;
  logo: any;
  data: any;
};

export type financialStatementProps = {
  isOwnedViewType: boolean;
  dataDetailLv1: dataLevelProps[];
  dataDetailLv2: string;
  pageView: number;
  total: number;
  refreshData: number;
};
