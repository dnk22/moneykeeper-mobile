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
  return queryAllAccount(rest);
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
      return queryUpdateAccount({ id, account }).then(async ({ isUpdateBalance, data }) => {
        if (isUpdateBalance) {
          await queryUpdateBalanceAfterUpdateAccount({ accountData: data });
          await queryCalculateAllBalanceAfterDate({
            accountId: data.id,
            date: 0,
            openAmount: data.creditCardLimit || data.initialAmount,
          });
        }
      });
    } else {
      return queryAddAccount(account).then(async (res) => {
        await queryAddBalanceFromAccount(res);
      });
    }
  } catch (error) {
    handleError({
      error: error,
    });
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
