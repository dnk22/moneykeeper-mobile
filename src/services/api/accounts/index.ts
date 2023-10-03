import { TGetAccounts, getAccounts, getActiveAccountObserve } from 'database/querying';

export function fetchAccountData(isActive: boolean) {
  return getActiveAccountObserve(isActive);
}
export async function getAccountsData(query: TGetAccounts) {
  return getAccounts(query);
}
