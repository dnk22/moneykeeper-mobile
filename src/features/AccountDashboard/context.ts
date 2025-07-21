import { createContext } from 'react';
import { TAccount } from 'database/types';
import { ACCOUNT_STATUS } from '.';

export const AccountContext = createContext<{
  accountPressed?: TAccount;
  isShowModal: boolean;
  onToggleModal: () => void;
  onActionPress: (T: TAccount) => void;
  ACCOUNT_STATUS: typeof ACCOUNT_STATUS;
  isActiveAccount: ACCOUNT_STATUS;
  setIsActiveAccount: (status: ACCOUNT_STATUS) => void;
}>({
  ACCOUNT_STATUS,
  isActiveAccount: ACCOUNT_STATUS.ACTIVE,
  accountPressed: undefined,
  isShowModal: false,
  onToggleModal: () => {},
  onActionPress: (T: TAccount) => {},
  setIsActiveAccount: () => {},
});
