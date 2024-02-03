import {
  TGetAllAccounts,
  queryAddAccount,
  queryDeleteAccount,
  queryAccountById,
  queryUpdateAccount,
  queryAllAccount,
  queryChangeAccountStatusById,
  queryGetFirstAccount,
  queryAddBalanceFromAccount,
  queryUpdateBalanceAfterUpdateAccount,
  queryCalculateAllBalanceAfterDate,
} from 'database/querying';
import { TAccount } from 'database/types';
import { handleError } from 'utils/axios';

export async function getAccountData({ ...rest }: TGetAllAccounts) {
  return await queryAllAccount(rest);
}

/**
 *
 * @param id
 * @param account
 * create: after created , if done => add balance also
 * update: after updated, if done => update balance and calculate all openAmount and closingAmount if have record
 */
export async function updateAccountDB({ id, account }: { id?: string; account: TAccount }) {
  try {
    if (id) {
      delete account.id;
      return await queryUpdateAccount({ id, account }).then(async ({ isUpdateBalance, data }) => {
        if (isUpdateBalance) {
          await queryUpdateBalanceAfterUpdateAccount({ accountData: data });
          await queryCalculateAllBalanceAfterDate({
            accountId: data.id,
            date: 0,
          });
        }
        return id;
      });
    } else {
      return await queryAddAccount(account).then(async (res) => {
        await queryAddBalanceFromAccount(res);
        return res.accountId;
      });
    }
  } catch (error) {
    handleError({
      error: error,
    });
  }
}

export async function getAccountById(id: string, getAll?: boolean) {
  return queryAccountById(id, getAll);
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
