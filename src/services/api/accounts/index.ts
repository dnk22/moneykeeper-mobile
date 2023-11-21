import {
  TGetAccounts,
  queryAddAccount,
  deleteAccount,
  getAccounts,
  getActiveAccountObserve,
  queryAccountById,
  queryUpdateAccount,
} from 'database/querying';
import { TAccount } from 'database/types';

export function fetchAccountData(isActive: boolean, exclude?: string) {
  return getActiveAccountObserve(isActive, exclude);
}
export async function getAccountsData(query: TGetAccounts) {
  return getAccounts(query);
}

export async function updateAccountDB({ id, data }: { id?: string; data: TAccount }) {
  if (id) {
    delete data.id;
    return await queryUpdateAccount({ id, account: data });
  } else {
    return await queryAddAccount(data);
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
