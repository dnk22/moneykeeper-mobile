import { createContext } from 'react';
import { TAccount } from 'database/types';

export const AccountContext = createContext<{
  onActionPress: (T: TAccount) => void;
}>({
  onActionPress: (T: TAccount) => {},
});
