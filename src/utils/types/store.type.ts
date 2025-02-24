import { WidgetOrderListProps } from 'features/Dashboard/constants';
import { COLOR_SCHEME } from 'resources/theme/constants';
import { VIEW_CATEGORY_FAST_BY_COLUMN } from 'utils/constants';
import { HOME_BOTTOM_BAR, SORT_ACCOUNT_BY_KEY } from 'utils/constants/appSettings';

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
