import { ROUTES } from 'navigation/constants/routes';
import { SCREEN_WIDTH } from 'share/dimensions';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';

export const ITEM_WIDTH = (SCREEN_WIDTH - 40 - 4 * 4) / 4;

export const mapTitle: Record<string, string> = {
  [ROUTES.INCOME_CATEGORY]: 'Danh Mục Thu',
  [ROUTES.EXPENSE_CATEGORY]: 'Danh Mục Chi',
  [ROUTES.LEND_BORROW]: 'Danh Mục Vay Mượn',
};

export const mapTransactionCategoryType: Record<string, TRANSACTION_CATEGORY_TYPE> = {
  [ROUTES.EXPENSE_CATEGORY]: TRANSACTION_CATEGORY_TYPE.EXPENSE,
  [ROUTES.INCOME_CATEGORY]: TRANSACTION_CATEGORY_TYPE.INCOME,
};
