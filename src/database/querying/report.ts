import {
  TRANSACTION_CATEGORY_TYPE,
  TRANSACTION_LEND_BORROW_NAME,
  VIEW_EXPENSE_INCOME_REPORT_BY,
} from 'utils/constants';
import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { AccountModel, BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { TRANSACTION_TYPE } from 'utils/constants';
import get from 'lodash/get';
import { DebtLoanTypes } from 'utils/types';
import { TGetDebtLoanDetailByPerson } from 'utils/types/request.type';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';

export type TQueryGetExpenseIncomeReportGroupByDate = {
  date: Date;
  totalIncome: number;
  totalExpense: number;
};

export class ReportLocalQuery {
  private static instance: ReportLocalQuery;

  private transactionsCollection = database.collections.get<TransactionModel>(TRANSACTIONS);
  private accountsCollection = database.collections.get<AccountModel>(ACCOUNTS);
  private balanceCollection = database.collections.get<BalanceModel>(BALANCE);

  private debtLoanCategory = `(
    '${TRANSACTION_LEND_BORROW_NAME.BORROW}', 
    '${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}', 
    '${TRANSACTION_LEND_BORROW_NAME.LEND}', 
    '${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}'
  )`;

  private constructor() {}

  public static getInstance(): ReportLocalQuery {
    if (!ReportLocalQuery.instance) {
      ReportLocalQuery.instance = new ReportLocalQuery();
    }
    return ReportLocalQuery.instance;
  }

  private throwError(code: string, message?: string): never {
    throw new Error(message || `Report operation failed: ${code}`);
  }

  /**
   * Lấy tất cả dữ liệu số dư từ bảng balance
   *
   * @input
   * - Không có tham số đầu vào
   *
   * @output
   * - Promise<any[]> - Danh sách tất cả các bản ghi số dư
   *
   * @flow
   * 1. Thực hiện truy vấn SQL để lấy tất cả dữ liệu từ bảng BALANCE
   * 2. Trả về kết quả dưới dạng raw data
   */
  public async queryGetAllBalance() {
    try {
      const query = `SELECT * FROM ${BALANCE}`;
      return await database.read(async () => {
        const res = await this.balanceCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
        console.log(res);
        return res;
      });
    } catch (error) {
      this.throwError('GET-ALL-BALANCE', 'Failed to get all balance data');
    }
  }

  /**
   * Lấy thông tin tổng kết tài khoản theo ID
   *
   * @input
   * - accountId: string - ID của tài khoản cần lấy thông tin
   *
   * @output
   * - Promise<{totalIncome: number, totalExpense: number} | null> - Tổng thu nhập và chi tiêu của tài khoản
   *
   * @flow
   * 1. Truy vấn tất cả giao dịch liên quan đến tài khoản (làm tài khoản nguồn hoặc đích)
   * 2. Tính tổng thu nhập (giao dịch dương + số tiền nhận được từ chuyển khoản)
   * 3. Tính tổng chi tiêu (giao dịch âm từ tài khoản nguồn)
   * 4. Trả về kết quả đầu tiên hoặc null nếu không có dữ liệu
   */
  public async queryGetSummaryAccountById({ accountId }: { accountId: string }) {
    try {
      return await database.read(async () => {
        const result = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT 
              SUM(CASE 
                  WHEN amount > 0 THEN amount 
                  ELSE 0 
              END) 
              + SUM(CASE 
                  WHEN amount < 0 AND toAccountId = '${accountId}' THEN toAmount 
                  ELSE 0 
              END) AS totalIncome,
              SUM(CASE 
                  WHEN amount < 0 AND accountId = '${accountId}' THEN amount 
                  ELSE 0 
              END) AS totalExpense 
          FROM ${TRANSACTIONS}
          WHERE (accountId='${accountId}' OR toAccountId='${accountId}')
              AND _status!='deleted'
              AND excludeReport=0`,
            ),
          )
          .unsafeFetchRaw();
        return result.length && result[0];
      });
    } catch (error) {
      this.throwError('GET-SUMMARY-ACCOUNT', 'Failed to get account summary');
    }
  }

  /**
   * Lấy số dư hiện tại của thẻ tín dụng theo ID tài khoản
   *
   * @input
   * - accountId: string - ID của tài khoản thẻ tín dụng
   *
   * @output
   * - Promise<number | null> - Số dư cuối cùng của tài khoản hoặc null nếu không có
   *
   * @flow
   * 1. Truy vấn số dư cuối cùng (closingAmount) từ bảng BALANCE
   * 2. Lọc theo accountId và lấy bản ghi có ngày gần nhất
   * 3. Trả về closingAmount nếu có dữ liệu, ngược lại trả về null
   */
  public async queryGetCurrentBalanceCreditCardByAccountId({ accountId }: { accountId: string }) {
    try {
      return await database.read(async () => {
        const result = await this.balanceCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT closingAmount, MAX(dateRecord) FROM ${BALANCE}
                WHERE accountId='${accountId}'`,
            ),
          )
          .unsafeFetchRaw();
        return result.length && result[0].closingAmount;
      });
    } catch (error) {
      this.throwError('GET-CURRENT-BALANCE', 'Failed to get current credit card balance');
    }
  }

  /**
   * Lấy tổng số tiền phải trả của thẻ tín dụng trong khoảng thời gian
   *
   * @input
   * - accountId: string - ID của tài khoản thẻ tín dụng
   * - startDate: number | Date - Ngày bắt đầu
   * - endDate: number | Date - Ngày kết thúc
   *
   * @output
   * - Promise<number> - Tổng số tiền chi tiêu trong khoảng thời gian hoặc 0
   *
   * @flow
   * 1. Kiểm tra tính hợp lệ của startDate và endDate
   * 2. Chuyển đổi thời gian thành UTC timestamps (đầu ngày và cuối ngày)
   * 3. Truy vấn tổng chi tiêu (giao dịch âm) của tài khoản trong khoảng thời gian
   * 4. Trả về tổng chi tiêu hoặc 0 nếu không có dữ liệu
   */
  public async queryGetPaymentDueCreditCardByAccountId({
    accountId,
    startDate,
    endDate,
  }: {
    accountId: string;
    startDate: number | Date;
    endDate: number | Date;
  }) {
    try {
      if (!startDate || !endDate) {
        return 0;
      }
      const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)).getTime();

      return await database.read(async () => {
        const result = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT 
              SUM(CASE 
                  WHEN amount < 0 AND accountId = '${accountId}' THEN amount 
                  ELSE 0 
              END) AS totalExpense 
          FROM ${TRANSACTIONS}
          WHERE (accountId='${accountId}' OR toAccountId='${accountId}') AND recordAt BETWEEN ${startOfDay} AND ${endOfDay}
              AND _status!='deleted' 
              AND excludeReport=0`,
            ),
          )
          .unsafeFetchRaw();
        return result.length && result[0].totalExpense;
      });
    } catch (error) {
      this.throwError('GET-PAYMENT-DUE', 'Failed to get credit card payment due');
    }
  }

  /**
   * Lấy tổng số dư hiện tại của tất cả tài khoản bao gồm cả nợ/cho vay
   *
   * @input
   * - Không có tham số đầu vào
   *
   * @output
   * - Promise<number> - Tổng số dư của tất cả tài khoản cộng với số dư nợ/cho vay
   *
   * @flow
   * 1. Đo thời gian thực hiện để theo dõi performance
   * 2. Lấy tổng số dư mới nhất của tất cả tài khoản từ bảng BALANCE
   * 3. Tính tổng số tiền nợ/cho vay từ các giao dịch liên quan
   * 4. Tính toán: tổng tiền trong tài khoản + (tiền cho vay - tiền đi vay)
   * 5. Log thời gian thực hiện và trả về kết quả
   */
  public async getCurrentBalanceAllAccount() {
    try {
      var startTime = performance.now();
      return await database.read(async () => {
        const totalMoneyInAccount = await this.accountsCollection
          .query(
            Q.experimentalJoinTables([TRANSACTIONS]),
            Q.unsafeSqlQuery(
              `SELECT acc.id, SUM(bal.closingAmount) AS value FROM ${ACCOUNTS} acc
              LEFT JOIN (
                SELECT
                  b._id,
                  b.accountId,
                  b.closingAmount,
                  b.dateRecord,
                  ROW_NUMBER() OVER (PARTITION BY b.accountId ORDER BY b.dateRecord DESC, b._id DESC) AS row_num
                FROM ${BALANCE} b
              ) bal ON bal.accountId = acc.id AND bal.row_num = 1
              WHERE acc._status!='deleted'`,
            ),
          )
          .unsafeFetchRaw();

        const debtLoan = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT 
              SUM(CASE 
                  WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.LEND}' THEN amount 
                  ELSE 0 
                END) + SUM(CASE 
                              WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}' THEN amount 
                              ELSE 0 
                           END) AS debt,
              SUM(CASE 
                  WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.BORROW}' THEN amount 
                  ELSE 0 
                END) + SUM(CASE 
                              WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}' THEN amount 
                              ELSE 0 
                           END) AS loan
            FROM ${TRANSACTIONS} trans
            LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
            WHERE trans._status != 'deleted' AND 
                  transC.categoryName IN ${this.debtLoanCategory}`,
            ),
          )
          .unsafeFetchRaw();

        const moneyAccountRemain = get(totalMoneyInAccount[0], 'value', 0);
        const debtLoanRemain = Math.abs(get(debtLoan[0], 'debt', 0)) - get(debtLoan[0], 'loan', 0);
        var endTime = performance.now();
        console.log(
          `get financial statement: ${Number((endTime - startTime) / 1000).toFixed(5)} s`,
        );
        return moneyAccountRemain + debtLoanRemain;
      });
    } catch (error) {
      this.throwError('GET-CURRENT-BALANCE-ALL', 'Failed to get current balance for all accounts');
    }
  }

  /**
   * Lấy báo cáo thu chi trong khoảng thời gian được chỉ định
   *
   * @input
   * - rangeDate: string - Loại khoảng thời gian ('now', 'quart', 'year', hoặc mặc định là tháng)
   *
   * @output
   * - Promise<{totalAmount: any[], categoryGroup: any[]}> - Tổng thu chi và nhóm theo danh mục
   *
   * @flow
   * 1. Xác định khoảng thời gian dựa vào tham số rangeDate:
   *    - 'now': ngày hiện tại
   *    - 'quart': quý hiện tại
   *    - 'year': năm hiện tại
   *    - mặc định: tháng hiện tại
   * 2. Truy vấn tổng thu nhập và chi tiêu trong khoảng thời gian
   * 3. Truy vấn chi tiêu theo nhóm danh mục cha
   * 4. Trả về object chứa cả hai kết quả
   */
  public async getExpenseIncomeInRangeDate(rangeDate: string) {
    try {
      let startDate: Date | number = new Date();
      let endDate: Date | number = new Date();

      switch (rangeDate) {
        case 'now':
          startDate = startDate.setUTCHours(0, 0, 0, 0);
          endDate = endDate.setUTCHours(23, 59, 59, 999);
          break;
        case 'quart':
          startDate = startOfQuarter(startDate).getTime();
          endDate = endOfQuarter(endDate).getTime();
          break;
        case 'year':
          startDate = startOfYear(startDate).getTime();
          endDate = endOfYear(endDate).getTime();
          break;
        default:
          startDate = startOfMonth(startDate).getTime();
          endDate = endOfMonth(endDate).getTime();
          break;
      }

      return await database.read(async () => {
        const totalAmount = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
              SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END) AS expense
              FROM ${TRANSACTIONS}
              WHERE _status!='deleted' AND transactionType != ${TRANSACTION_TYPE.TRANSFER} AND recordAt BETWEEN ${startDate} AND ${endDate}`,
            ),
          )
          .unsafeFetchRaw();

        const categoryGroup = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT
                  COALESCE(tc.parentId, t.categoryId) AS categoryParentId,
                  COALESCE(tc_parent.categoryName, 'Uncategorized') AS categoryName,
                  SUM(CASE WHEN t.amount < 0 THEN -t.amount ELSE 0 END) AS expense
              FROM
                  ${TRANSACTIONS} t
              JOIN
                  ${TRANSACTION_CATEGORY} tc ON t.categoryId = tc.id
              LEFT JOIN
                  ${TRANSACTION_CATEGORY} tc_parent ON COALESCE(tc.parentId, t.categoryId) = tc_parent.id
              WHERE
                  t._status!='deleted' 
                  AND t.transactionType != ${TRANSACTION_TYPE.TRANSFER} AND t.transactionType != ${TRANSACTION_TYPE.INCOME}
                  AND t.recordAt BETWEEN ${startDate} AND ${endDate}
              GROUP BY
                COALESCE(tc.parentId, t.categoryId) 
              ORDER BY expense DESC`,
            ),
          )
          .unsafeFetchRaw();

        return {
          totalAmount,
          categoryGroup,
        };
      });
    } catch (error) {
      this.throwError('GET-EXPENSE-INCOME-RANGE', 'Failed to get expense income in date range');
    }
  }

  /**
   * Lấy báo cáo tình hình tài khoản
   *
   * @input
   * - isOwnedViewType: boolean - true để loại trừ thẻ tín dụng, false để chỉ lấy thẻ tín dụng
   *
   * @output
   * - Promise<any[]> - Danh sách tài khoản với thông tin số dư mới nhất
   *
   * @flow
   * 1. Truy vấn danh sách tài khoản với LEFT JOIN để lấy số dư mới nhất
   * 2. Sử dụng ROW_NUMBER() để lấy bản ghi balance mới nhất của mỗi tài khoản
   * 3. Lọc tài khoản dựa vào isOwnedViewType để bao gồm/loại trừ thẻ tín dụng
   * 4. Trả về thông tin tài khoản bao gồm ID, tên, logo, trạng thái và số dư
   */
  public async queryAccountStatement({ isDebt }: { isDebt: boolean }): Promise<any[]> {
    try {
      return await database.read(async () => {
        return await this.accountsCollection
          .query(
            Q.experimentalJoinTables([TRANSACTIONS]),
            Q.unsafeSqlQuery(
              `SELECT acc.id, acc.accountName , acc.accountLogo AS logo, acc.isActive, acc.accountTypeId, acc.sortOrder, bal.closingAmount AS value FROM ${ACCOUNTS} acc
              LEFT JOIN (
                SELECT
                  b._id,
                  b.accountId,
                  b.closingAmount,
                  b.dateRecord,
                  ROW_NUMBER() OVER (PARTITION BY b.accountId ORDER BY b.dateRecord DESC, b._id DESC) AS row_num
                FROM ${BALANCE} b
              ) bal ON bal.accountId = acc.id AND bal.row_num = 1
              WHERE acc._status!='deleted' AND acc.accountTypeId ${isDebt ? '!=' : '='} ${
                ACCOUNT_CATEGORY_ID.CREDITCARD
              }`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('QUERY-ACCOUNT-STATEMENT', 'Failed to get account statement');
    }
  }

  /**
   * Lấy danh sách nợ/cho vay theo người liên quan
   *
   * @input
   * - isDebt: boolean - true để lấy danh sách nợ phải thu, false để lấy danh sách nợ phải trả
   *
   * @output
   * - Promise<DebtLoanTypes[]> - Danh sách nợ/cho vay được nhóm theo người liên quan
   *
   * @flow
   * 1. Xác định categoryName dựa vào tham số isDebt:
   *    - true: lấy giao dịch 'LEND' và 'COLLECT_DEBTS' (nợ phải thu)
   *    - false: lấy giao dịch 'BORROW' và 'REPAYMENT' (nợ phải trả)
   * 2. Truy vấn giao dịch với JOIN bảng TRANSACTION_CATEGORY
   * 3. Nhóm kết quả theo relatedPerson và tính tổng amount
   * 4. Trả về danh sách với thông tin người liên quan và tổng số tiền
   */
  public async queryGetDebtLoanList({ isDebt }: { isDebt: boolean }): Promise<DebtLoanTypes[]> {
    try {
      const categoryName = isDebt
        ? `'${TRANSACTION_LEND_BORROW_NAME.LEND}','${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}'`
        : `'${TRANSACTION_LEND_BORROW_NAME.BORROW}','${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}'`;

      return await database.read(async () => {
        return await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT trans.id, trans.categoryId, trans.relatedPerson, transC.categoryType, SUM(trans.amount) AS value, transC.categoryName FROM ${TRANSACTIONS} trans
              LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
              WHERE trans._status!='deleted' AND transC.categoryName IN (${categoryName}) GROUP BY trans.relatedPerson`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('GET-DEBT-LOAN-LIST', 'Failed to get debt/loan list');
    }
  }

  /**
   * Lấy tổng kết thống kê nợ/cho vay
   *
   * @input
   * - isDebt: boolean - true để lấy thống kê nợ phải thu, false để lấy thống kê nợ phải trả
   *
   * @output
   * - Promise<any[]> - Thống kê với tổng số tiền và số tiền đã thu/trả
   *
   * @flow
   * 1. Xác định categoryName dựa vào tham số isDebt
   * 2. Truy vấn tổng số tiền theo 2 loại:
   *    - total: tổng số tiền cho vay/đi vay ban đầu
   *    - collected: tổng số tiền đã thu hồi/đã trả
   * 3. Sử dụng CASE statement để phân loại và tính tổng
   * 4. Trả về kết quả thống kê tổng hợp
   */
  public async queryGetDebtLoanStatementSummary({ isDebt }: { isDebt: boolean }) {
    try {
      return await database.read(async () => {
        const categoryName = isDebt
          ? `'${TRANSACTION_LEND_BORROW_NAME.LEND}','${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}'`
          : `'${TRANSACTION_LEND_BORROW_NAME.BORROW}','${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}'`;

        return await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT SUM(CASE 
                WHEN transC.categoryName = '${
                  isDebt ? TRANSACTION_LEND_BORROW_NAME.LEND : TRANSACTION_LEND_BORROW_NAME.BORROW
                }' THEN amount 
                ELSE 0 
              END) AS total, 
                SUM(CASE 
                WHEN transC.categoryName = '${
                  isDebt
                    ? TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS
                    : TRANSACTION_LEND_BORROW_NAME.REPAYMENT
                }' THEN amount 
                ELSE 0 
              END) AS collected FROM ${TRANSACTIONS} trans
              LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
              WHERE trans._status!='deleted' AND transC.categoryName IN (${categoryName})`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('GET-DEBT-LOAN-SUMMARY', 'Failed to get debt/loan statement summary');
    }
  }
  /**
   * Lấy chi tiết giao dịch nợ/cho vay theo người liên quan
   *
   * @input
   * - relatedPerson: string - Tên người liên quan
   * - type: TRANSACTION_CATEGORY_TYPE - Loại giao dịch (0 cho nợ phải thu, khác 0 cho nợ phải trả)
   *
   * @output
   * - Promise<TGetDebtLoanDetailByPerson[]> - Chi tiết các giao dịch nợ/cho vay
   *
   * @flow
   * 1. Xác định categoryName dựa vào tham số type:
   *    - type = 0: lấy giao dịch 'LEND' và 'COLLECT_DEBTS'
   *    - type khác 0: lấy giao dịch 'BORROW' và 'REPAYMENT'
   * 2. Truy vấn với nhiều LEFT JOIN để lấy thông tin đầy đủ:
   *    - TRANSACTION_CATEGORY: thông tin danh mục
   *    - ACCOUNTS: thông tin tài khoản
   *    - BALANCE: thông tin số dư
   * 3. Lọc theo relatedPerson và categoryName
   * 4. Trả về chi tiết giao dịch bao gồm mô tả, số tiền, thời gian và thông tin tài khoản
   */
  public async queryGetDebtLoanDetailByPerson({
    relatedPerson,
    type,
  }: {
    relatedPerson: string;
    type: TRANSACTION_CATEGORY_TYPE;
  }): Promise<TGetDebtLoanDetailByPerson[]> {
    try {
      return await database.read(async () => {
        const categoryName = !type
          ? `'${TRANSACTION_LEND_BORROW_NAME.LEND}','${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}'`
          : `'${TRANSACTION_LEND_BORROW_NAME.BORROW}','${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}'`;

        return await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT trans.id, bal._id, transC.categoryType, transC.categoryName, transC.icon, trans.descriptions, trans.amount, trans.recordAt, acc.accountLogo, acc.accountName FROM ${TRANSACTIONS} trans
              LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
              LEFT JOIN ${ACCOUNTS} acc ON acc.id = trans.accountId
              LEFT JOIN ${BALANCE} bal ON bal.transactionId = trans.id
              WHERE trans._status!='deleted' AND trans.relatedPerson = '${relatedPerson}' AND transC.categoryName IN (${categoryName})`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('GET-DEBT-LOAN-DETAIL', 'Failed to get debt/loan detail by person');
    }
  }

  /**
   * Lấy báo cáo thu chi theo ngày hiện tại với tùy chọn bao gồm nợ/cho vay
   *
   * @input
   * - isIncludesDetLoan?: boolean - Có bao gồm giao dịch nợ/cho vay hay không
   * - startDate: Date - Ngày bắt đầu
   * - endDate: Date - Ngày kết thúc
   *
   * @output
   * - Promise<any[]> - Báo cáo với tổng thu nhập và chi tiêu
   *
   * @flow
   * 1. Chuyển đổi startDate và endDate thành UTC timestamps (đầu ngày và cuối ngày)
   * 2. Xây dựng điều kiện debtLoanQuery dựa vào isIncludesDetLoan:
   *    - false: loại trừ các giao dịch nợ/cho vay
   *    - true: bao gồm tất cả giao dịch
   * 3. Truy vấn tổng thu nhập (amount >= 0) và chi tiêu (amount < 0)
   * 4. Lọc theo thời gian, trạng thái và excludeReport
   * 5. Trả về kết quả tổng hợp
   */
  public async queryGetExpenseIncomeReportByCurrentDate({
    isIncludesDetLoan,
    startDate,
    endDate,
  }: {
    isIncludesDetLoan?: boolean;
    startDate: Date;
    endDate: Date;
  }) {
    try {
      const startOfDate = new Date(startDate).setUTCHours(0, 0, 0, 0);
      const endOfDate = new Date(endDate).setUTCHours(23, 59, 59, 999);

      const debtLoanQuery = !isIncludesDetLoan
        ? `AND transC.categoryName NOT IN ${this.debtLoanCategory}`
        : '';

      return await database.read(async () => {
        return await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT 
              SUM(CASE 
                  WHEN amount >= 0 THEN amount 
                  ELSE 0 
              END)AS totalIncome,
              SUM(CASE 
                  WHEN amount < 0 THEN amount 
                  ELSE 0 
              END) AS totalExpense
            FROM ${TRANSACTIONS} trans
            LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
            WHERE trans._status!='deleted' ${debtLoanQuery} AND trans.excludeReport=0 AND trans.recordAt BETWEEN ${startOfDate} AND ${endOfDate}`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError(
        'GET-EXPENSE-INCOME-CURRENT-DATE',
        'Failed to get expense income report by current date',
      );
    }
  }

  /**
   * Lấy báo cáo thu chi được nhóm theo ngày/tháng/quý/năm
   *
   * @input
   * - type: VIEW_EXPENSE_INCOME_REPORT_BY - Loại nhóm theo thời gian (tháng, quý, năm)
   * - isIncludesDetLoan?: boolean - Có bao gồm giao dịch nợ/cho vay hay không
   * - startDate: Date - Ngày bắt đầu
   * - endDate: Date - Ngày kết thúc
   *
   * @output
   * - Promise<TQueryGetExpenseIncomeReportGroupByDate[]> - Báo cáo nhóm theo thời gian
   *
   * @flow
   * 1. Chuyển đổi startDate và endDate thành UTC timestamps
   * 2. Xây dựng điều kiện debtLoanQuery dựa vào isIncludesDetLoan
   * 3. Thiết lập groupByType và selectDateQuery dựa vào tham số type:
   *    - MONTH: nhóm theo tháng (YYYY-MM)
   *    - QUARTER: nhóm theo quý (YYYY-Q)
   *    - YEAR: nhóm theo năm (YYYY)
   * 4. Thực hiện truy vấn với GROUP BY và ORDER BY phù hợp
   * 5. Trả về dữ liệu đã nhóm với totalIncome, totalExpense và date
   */
  public async queryGetExpenseIncomeReportGroupByDate({
    type,
    isIncludesDetLoan,
    startDate,
    endDate,
  }: {
    type: VIEW_EXPENSE_INCOME_REPORT_BY;
    isIncludesDetLoan?: boolean;
    startDate: Date;
    endDate: Date;
  }): Promise<TQueryGetExpenseIncomeReportGroupByDate[]> {
    try {
      let groupByType = '';
      let selectDateQuery = `strftime('%Y-%m', datetime(recordAt/1000, 'unixepoch'))  AS date`;
      // Convert start and end dates to UTC timestamps
      const startOfDate = new Date(startDate).setUTCHours(0, 0, 0, 0);
      const endOfDate = new Date(endDate).setUTCHours(23, 59, 59, 999);

      // Generate debt loan query based on whether to include debt/loan transactions
      const debtLoanQuery = !isIncludesDetLoan
        ? `AND transC.categoryName NOT IN ${this.debtLoanCategory}`
        : '';

      switch (type) {
        case VIEW_EXPENSE_INCOME_REPORT_BY.MONTH:
          groupByType = `GROUP BY strftime('%Y-%m', datetime(recordAt/1000, 'unixepoch')) 
              ORDER BY strftime('%Y-%m', datetime(recordAt/1000, 'unixepoch')) DESC;`;
          break;
        case VIEW_EXPENSE_INCOME_REPORT_BY.QUARTER:
          selectDateQuery = `strftime('%Y', datetime(recordAt/1000, 'unixepoch')) || '-' ||
              CASE 
                  WHEN strftime('%m', datetime(recordAt/1000, 'unixepoch')) BETWEEN '01' AND '03' THEN '1' 
                  WHEN strftime('%m', datetime(recordAt/1000, 'unixepoch')) BETWEEN '04' AND '06' THEN '4' 
                  WHEN strftime('%m', datetime(recordAt/1000, 'unixepoch')) BETWEEN '07' AND '09' THEN '7' 
                  ELSE '10'
              END AS date`;
          groupByType = `GROUP BY date
              ORDER BY date DESC`;
          break;
        case VIEW_EXPENSE_INCOME_REPORT_BY.YEAR:
          groupByType = `GROUP BY strftime('%Y', datetime(recordAt/1000, 'unixepoch')) 
              ORDER BY strftime('%Y', datetime(recordAt/1000, 'unixepoch')) DESC;`;
          break;
        default:
          break;
      }

      return await database.read(async () => {
        return await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT 
              SUM(CASE 
                  WHEN amount >= 0 THEN amount 
                  ELSE 0 
              END)AS totalIncome,
              SUM(CASE 
                  WHEN amount < 0 THEN amount 
                  ELSE 0 
              END) AS totalExpense,
              ${selectDateQuery}
            FROM ${TRANSACTIONS} trans
            LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
            WHERE trans._status!='deleted' ${debtLoanQuery} AND trans.excludeReport=0 AND trans.recordAt BETWEEN ${startOfDate} AND ${endOfDate}
            ${groupByType}`,
            ),
          )
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError(
        'GET-EXPENSE-INCOME-GROUP-BY-DATE',
        'Failed to get expense income report group by date',
      );
    }
  }
}

export const reportLocalQuery = ReportLocalQuery.getInstance();
