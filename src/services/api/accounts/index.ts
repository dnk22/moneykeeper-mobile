import {
  TGetAccounts,
  addAccount,
  deleteAccount,
  getAccounts,
  getActiveAccountObserve,
  queryAccountById,
  updateAccount,
} from 'database/querying';
import { TAccount } from 'database/types';

export function fetchAccountData(isActive: boolean) {
  return getActiveAccountObserve(isActive);
}
export async function getAccountsData(query: TGetAccounts) {
  return getAccounts(query);
}
export async function updateAccountDB({ id, data }: { id?: string; data: TAccount }) {
  if (id) {
    delete data.id
    updateAccount({ id, account: data });
  } else {
    addAccount(data);
  }
}
export async function getAccountById(id: string) {
  const res = await queryAccountById(id);
  return res;
}
export async function deleteAccountById(id: string) {
  const res = await deleteAccount(id);
  return res;
}
