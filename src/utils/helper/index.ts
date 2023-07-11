import { MAP_LEND_BORROW, TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

export const mapCategoryTypeToTransactionType = ({ type, value }: any) => {
  if (type === TRANSACTION_CATEGORY_TYPE.LEND_BORROW) {
    return MAP_LEND_BORROW[value];
  } else {
    return type;
  }
};
