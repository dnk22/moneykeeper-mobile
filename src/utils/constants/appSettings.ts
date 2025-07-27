import { WIDGET_INIT_LIST } from 'features/Dashboard/constants';
import { ROUTES } from 'navigation/constants/routes';
import { COLOR_SCHEME } from 'resources/theme/constants';
import { TSettings } from 'utils/types/store.type';

const defaultSettings: TSettings = {
  config: {
    hideBalance: false,
    dateFormat: 'DD/MM/YYYY',
    screenDefault: ROUTES.DASHBOARD,
  },
  notification: {
    enabled: true,
    sound: true,
    time: '08:00',
  },
  appearance: {
    auto: true,
    darkMode: false,
    color: COLOR_SCHEME.modernBlue,
    isBottomBarFlat: true,
    homeWidgetOrder: WIDGET_INIT_LIST,
  },
  report: {
    startDayOfWeek: 0, // Chủ nhật
    startDateOfMonth: 1, // Ngày đầu tháng
    startMonthOfYear: 0, // Tháng 1
  },
  security: {
    pinCode: '',
    biometricEnabled: false,
  },
  accounts: {
    sortByName: true,
    sortOrder: [],
    sortOrderInGroup: [],
    groupByType: true,
  },
  transactions: {
    display: {
      income: true,
      expense: true,
      amount: true,
      description: true,
    },
  },
  categories: {
    orderBy: 'name',
    fastViewByMost: true,
  },
};

export default defaultSettings;
