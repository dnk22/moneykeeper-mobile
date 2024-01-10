// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';
import {
  ACCOUNTS,
  BALANCE,
  BANKS,
  CONTACT,
  TRANSACTIONS,
  TRANSACTION_CATEGORY,
} from 'database/constants';
import { SORT_ACCOUNT_BY_KEY } from 'utils/constant';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: ACCOUNTS,
      columns: [
        { name: SORT_ACCOUNT_BY_KEY.accountName, type: 'string' },
        { name: 'accountLogo', type: 'string' },
        { name: 'initialAmount', type: 'number' },
        { name: 'accountTypeId', type: 'number' },
        { name: 'accountTypeName', type: 'string' },
        { name: 'bankId', type: 'string', isOptional: true },
        { name: 'currency', type: 'string', isOptional: true },
        { name: 'descriptions', type: 'string', isOptional: true },
        { name: 'isActive', type: 'boolean' },
        { name: 'excludeReport', type: 'boolean', isOptional: true },
        { name: 'userId', type: 'string', isOptional: true },
        { name: SORT_ACCOUNT_BY_KEY.sortOrder, type: 'number', isOptional: true },
        // fields for savings account
        { name: 'termType', type: 'number', isOptional: true },
        { name: 'termMonth', type: 'number', isOptional: true },
        { name: 'interestRate', type: 'number', isOptional: true },
        { name: 'interestPaymentType', type: 'number', isOptional: true },
        { name: 'dueType', type: 'number', isOptional: true },
        { name: 'startDate', type: 'number', isOptional: true },
        { name: 'endDate', type: 'number', isOptional: true },
        { name: 'interestPaymentToAccount', type: 'string', isOptional: true },
        { name: 'savingFromAccountId', type: 'string', isOptional: true },
        { name: 'numberDayOfYear', type: 'number', isOptional: true },
        // credit card
        { name: 'creditCardLimit', type: 'number' },
        { name: 'creditCardIsReminder', type: 'boolean' },
        { name: 'creditCardReminderList', type: 'string' },
        { name: 'creditCardStatementDay', type: 'number' },
        { name: 'creditCardDayAfterStatement', type: 'number' },
      ],
    }),
    tableSchema({
      name: BANKS,
      columns: [
        { name: 'bankCode', type: 'string' },
        { name: 'bankName', type: 'string' },
        { name: 'shortName', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'isSystem', type: 'boolean' },
        { name: 'type', type: 'string' },
      ],
    }),
    tableSchema({
      name: TRANSACTIONS,
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'toAmount', type: 'number' },
        { name: 'transactionType', type: 'number' },
        { name: 'categoryId', type: 'string' },
        { name: 'descriptions', type: 'string', isOptional: true },
        { name: 'dateTimeAt', type: 'number' },
        { name: 'accountId', type: 'string', isOptional: true },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'eventName', type: 'string', isOptional: true },
        { name: 'fee', type: 'number', isOptional: true },
        { name: 'feeType', type: 'string', isOptional: true },
        { name: 'excludeReport', type: 'number', isOptional: true },
        { name: 'attachment', type: 'string', isOptional: true },
        { name: 'userId', type: 'string', isOptional: true },
        { name: 'giver', type: 'string', isOptional: true },
        { name: 'payee', type: 'string', isOptional: true },
        // lend and borrow
        { name: 'relatedPerson', type: 'string', isOptional: true },
        // transfer
        { name: 'toAccountId', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TRANSACTION_CATEGORY,
      columns: [
        { name: 'categoryName', type: 'string' },
        { name: 'categoryType', type: 'number' },
        { name: 'dictionaryKey', type: 'number' },
        { name: 'parentId', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'isSystem', type: 'boolean', isOptional: true },
        { name: 'useCount', type: 'number', isOptional: true },
        { name: 'sortOrder', type: 'number', isOptional: true },
        { name: 'lastUseAt', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: BALANCE,
      columns: [
        { name: '_id', type: 'number' },
        { name: 'transactionId', type: 'string', isOptional: true },
        { name: 'accountId', type: 'string', isOptional: true },
        { name: 'openAmount', type: 'number' },
        { name: 'movementAmount', type: 'number' },
        { name: 'closingAmount', type: 'number' },
        { name: 'transactionDateAt', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: CONTACT,
      columns: [{ name: 'contactName', type: 'string' }],
    }),
  ],
});
