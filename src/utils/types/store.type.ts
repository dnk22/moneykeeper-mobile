import { WidgetOrderListProps } from 'features/Dashboard/constants';
import { COLOR_SCHEME } from 'resources/theme/constants';
import { FLAT, SORT_ACCOUNT_BY_KEY, STICKY, VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constants';

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
  homeBottomBarType: typeof FLAT | typeof STICKY;
  viewCategoryMostAndRecent: keyof typeof VIEW_CATEGORY_FAST_BY_COLUMN;
  widgetOrder: WidgetOrderListProps[];
  theme: ThemeProps;
};
