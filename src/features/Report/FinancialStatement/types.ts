export type dataLevelProps = {
  accountName?: string;
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
  dataDetailLv2: dataLevelProps[];
  pageView: number;
  total: number;
};
