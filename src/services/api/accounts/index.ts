import {
  TGetAllAccounts,
  queryAddAccount,
  deleteAccount,
  queryAccountById,
  queryUpdateAccount,
  queryAllAccount,
} from 'database/querying';
import { queryAddBalance } from 'database/querying/balance.query';
import { TAccount } from 'database/types';

export async function getAccountData({ ...rest }: TGetAllAccounts) {
  return queryAllAccount(rest);
}

export async function updateAccountDB({ id, data }: { id?: string; data: TAccount }) {
  if (id) {
    delete data.id;
    return await queryUpdateAccount({ id, account: data });
  } else {
    return queryAddAccount(data).then(async ({ id }) => {
      return await queryAddBalance({
        accountId: id,
        openAmount: data?.initialAmount,
        closingAmount: data?.initialAmount,
        transactionDateAt: null,
      });
    });
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
