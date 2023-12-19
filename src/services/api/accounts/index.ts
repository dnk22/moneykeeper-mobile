import {
  TGetAllAccounts,
  queryAddAccount,
  queryDeleteAccount,
  queryAccountById,
  queryUpdateAccount,
  queryAllAccount,
  queryChangeAccountStatusById,
  queryGetFirstAccount,
} from 'database/querying';
import { TAccount } from 'database/types';

export async function getAccountData({ ...rest }: TGetAllAccounts) {
  return queryAllAccount(rest);
}

export async function updateAccountDB({ id, data }: { id?: string; data: TAccount }) {
  if (id) {
    delete data.id;
    return await queryUpdateAccount({ id, account: data });
  } else {
    return queryAddAccount(data);
  }
}

export async function getAccountById(id: string) {
  const res = await queryAccountById(id);
  return res;
}
export async function getFirstAccount() {
  return await queryGetFirstAccount();
}

export async function deleteAccountById(id: string) {
  return await queryDeleteAccount(id);
}

export async function changeAccountStatusById(id: string) {
  return await queryChangeAccountStatusById(id);
}
