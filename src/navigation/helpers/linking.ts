// Trong AppNavigators.tsx
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from 'utils/types/navigation';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['moneykeeper://', 'https://moneykeeper.app'],
  config: {
    screens: {
      [MAIN]: {
        screens: {
          [DASHBOARD]: 'dashboard',
          [ACCOUNT]: 'account',
          [TRANSACTIONS]: 'transactions',
          [REPORT]: 'report',
          [SETTINGS]: 'settings',
        },
      },
      [MODAL_STACK]: {
        screens: {
          [BANK_NAVIGATION]: 'bank',
          [TRANSACTION_CATEGORY]: 'category',
          [WIDGET_SETTINGS]: 'widget-settings',
        },
      },
    },
  },
};
