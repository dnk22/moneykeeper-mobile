import { WidgetOrderListProps } from 'features/Dashboard/constants';
import { COLOR_SCHEME } from 'resources/theme/constants';
import {
  HOME_BOTTOM_BAR,
  SORT_ACCOUNT_BY_KEY,
  VIEW_CATEGORY_FAST_BY_COLUMN,
} from 'utils/constants';

export type AccountViewSettingsProps = {
  sort: keyof typeof SORT_ACCOUNT_BY_KEY;
  group: boolean;
  isViewActive: boolean;
};

export type ThemeProps = {
  auto: boolean;
  darkMode: boolean;
  color: COLOR_SCHEME;
};

export type AppStateProps = {
  accountViewSettings: AccountViewSettingsProps;
  isReportViewByGrid: boolean;
  transactionListDisplayConfig: Record<string, boolean>;
  homeBottomBarType: HOME_BOTTOM_BAR;
  viewCategoryMostAndRecent: keyof typeof VIEW_CATEGORY_FAST_BY_COLUMN;
  widgetOrder: WidgetOrderListProps[];
  theme: ThemeProps;
};
