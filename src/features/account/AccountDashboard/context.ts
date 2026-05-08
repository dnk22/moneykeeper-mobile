import { createContext } from 'react';
import { TAccount } from 'database/types';

export const AccountContext = createContext<{
  onActionPress: (account: TAccount) => void;
}>({
  onActionPress: (_account: TAccount) => {},
});
