import { RootState } from 'store/index';
import {
  accountAdapter,
  TAccountSlice,
  accountSlice,
  accountTypeAdapter,
  providerAdapter,
  bankAdapter,
} from './account.slice';

// export selectors
export const accountSelectors = accountAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].account,
);
export const accountTypeSelectors = accountTypeAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].account_type,
);
export const providerSelectors = providerAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].provider,
);
export const bankSelectors = bankAdapter.getSelectors<TAccountSlice>(
  (state) => state[accountSlice.name].bank,
);
