import {
  TGetAllAccounts,
  queryAddAccount,
  queryAccountById,
  queryUpdateAccount,
  queryAllAccount,
  queryChangeAccountStatusById,
  queryGetFirstAccount,
  queryAddBalanceFromAccount,
  queryUpdateBalanceAfterUpdateAccount,
  queryCalculateAllBalanceAfterDate,
  queryDeleteAllTransactionRelatedWithAccountId,
  queryDeleteAccountById,
} from 'database/querying';
import { TAccount } from 'database/types';
import { ApiResponse } from 'services/axios';
import { showToast } from 'utils/system';

export async function fetchAccountList(
  payload: TGetAllAccounts = {},
): Promise<ApiResponse<TAccount[]>> {
  try {
    return {
      status: 200,
      data: await queryAllAccount(payload),
    };
  } catch (error) {
    showToast({
      type: 'info',
    });
    return {
      status: 200,
      data: [],
    };
  }
}

/**
 *
 * @param id
 * @param account
 * create: after created , if done => add balance also
 * update: after updated, if done => update balance and calculate all openAmount and closingAmount if have record
 */
export async function updateAccountDB({ id, account }: { id?: string; account: TAccount }) {
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
}

export async function getAccountById(id: string, getAll?: boolean) {
  return queryAccountById(id, getAll);
}
export async function getFirstAccount() {
  return await queryGetFirstAccount();
}

export async function deleteAccountById(accountId: string) {
  return await queryDeleteAllTransactionRelatedWithAccountId(accountId).then(
    async (accountReCalculateBalance: { accountId: string; dateTimeAt: number }[]) => {
      if (accountReCalculateBalance.length) {
        await queryDeleteAccountById(accountId);
        // calculate account balance
        const accountCalc = accountReCalculateBalance.filter(
          (item) => item.accountId !== accountId,
        );
        for await (const { accountId, dateTimeAt } of accountCalc) {
          await queryCalculateAllBalanceAfterDate({
            accountId,
            date: dateTimeAt,
          });
        }
      }
    },
  );
}

export async function changeAccountStatusById(id: string) {
  return await queryChangeAccountStatusById(id);
}
