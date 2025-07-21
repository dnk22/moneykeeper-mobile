import {
  queryAddAccount,
  queryUpdateAccount,
  queryChangeAccountStatusById,
  queryGetFirstAccount,
  queryAddBalanceFromAccount,
  queryUpdateBalanceAfterUpdateAccount,
  queryCalculateAllBalanceAfterDate,
  queryDeleteAllTransactionRelatedWithAccountId,
  queryDeleteAccountById,
} from 'database/querying';
import { TAccount } from 'database/types';

/**
 *
 * @param id
 * @param account
 * create: after created , if done => add balance also
 * update: after updated, if done => update balance and calculate all openAmount and closingAmount if have record
 */
export async function requestUpdateAccount({ id, account }: { id?: string; account: TAccount }) {
  try {
    if (id) {
      delete account.id;
      return await queryUpdateAccount({ id, account }).then(async ({ isUpdateBalance, data }) => {
        if (isUpdateBalance) {
          await queryUpdateBalanceAfterUpdateAccount({ accountData: data });
          await queryCalculateAllBalanceAfterDate({
            accountId: id,
            date: 0,
          });
        }
        return id;
      });
    } else {
      return await queryAddAccount(account).then(async (newAccount) => {
        await queryAddBalanceFromAccount(newAccount);
        return newAccount.accountId;
      });
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getFirstAccount() {
  return await queryGetFirstAccount();
}

export async function requestDeleteAccount(accountId: string) {
  try {
    await queryDeleteAccountById(accountId);
    return await queryDeleteAllTransactionRelatedWithAccountId(accountId).then(
      async (accountReCalculateBalance: { accountId: string; dateTimeAt: number }[]) => {
        if (accountReCalculateBalance.length) {
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
  } catch (error) {}
}

export async function changeAccountStatusById(id: string) {
  return await queryChangeAccountStatusById(id);
}

