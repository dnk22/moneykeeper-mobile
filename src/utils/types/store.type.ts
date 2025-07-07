import { COLOR_SCHEME } from 'resources/theme/constants';

export type ThemeProps = {
  auto: boolean;
  darkMode: boolean;
  color: COLOR_SCHEME;
};

export type TSettings = {
  config: {
    dateFormat?: string;
    screenDefault?: string;
    hideBalance?: boolean;
  };
  notification?: {
    enabled: boolean;
    sound: boolean;
    time: string;
  };
  appearance: {
    auto: boolean;
    darkMode: boolean;
    color: COLOR_SCHEME;
    isBottomBarFlat: boolean;
    homeWidgetOrder: Array<{
      key: string;
      label: string;
      isActive: boolean;
    }>;
  };
  report?: {
    startDayOfWeek?: number;
    startDateOfMonth?: number;
    startMonthOfYear?: number;
  };
  security?: {
    pinCode?: string;
    biometricEnabled?: boolean;
  };
  accounts: {
    sortByName?: boolean;
    sortOrder?: Array<string>[];
    sortOrderInGroup?: Array<{ key: string; value: Array<string> }>[];
    groupByType?: boolean;
  };
  transactions: {
    display: {
      income?: boolean;
      expense?: boolean;
      amount?: boolean;
      description?: boolean;
    };
  };
  categories?: {
    orderBy?: string;
    fastViewByMost?: boolean;
  };
};
export type TonBoardingConfig = {
  appearance: Pick<TSettings['appearance'], 'auto' | 'darkMode'>;
  report: TSettings['report'];
};

export type AppStateProps = TSettings & {
  appLoading: boolean;
  authState: {
    isLoggedIn: boolean;
    isOnboarded: boolean;
  };
};
