// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';
import {
  ACCOUNTS,
  BANKS,
  TRANSACTIONS,
  TRANSACTION_CATEGORY,
} from 'database/constants';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: ACCOUNTS,
      columns: [
        { name: 'account_name', type: 'string' },
        { name: 'account_logo', type: 'string' },
        { name: 'initial_amount', type: 'number' },
        { name: 'current_amount', type: 'number' },
        { name: 'account_type_id', type: 'string' },
        { name: 'account_type_name', type: 'string' },
        { name: 'bank_id', type: 'string', isOptional: true },
        { name: 'currency', type: 'string', isOptional: true },
        { name: 'descriptions', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_not_add_report', type: 'boolean', isOptional: true },
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'sort_order', type: 'number', isOptional: true },
        // fields for savings account
        { name: 'term_type', type: 'number', isOptional: true },
        { name: 'term_month', type: 'number', isOptional: true },
        { name: 'interest_rate', type: 'number', isOptional: true },
        { name: 'interest_payment_type', type: 'number', isOptional: true },
        { name: 'due_type', type: 'number', isOptional: true },
        { name: 'start_date', type: 'number', isOptional: true },
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'interest_payment_to_account', type: 'string', isOptional: true },
        { name: 'saving_from_account_id', type: 'string', isOptional: true },
        { name: 'number_day_of_year', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: BANKS,
      columns: [
        { name: 'bank_code', type: 'string' },
        { name: 'bank_name', type: 'string' },
        { name: 'short_name', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'is_system', type: 'boolean' },
        { name: 'is_wallet', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: TRANSACTIONS,
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'transactions_typeid', type: 'string' },
        { name: 'transactions_category_id', type: 'string' },
        { name: 'descriptions', type: 'string', isOptional: true },
        { name: 'date_time_at', type: 'number', isIndexed: true },
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'event_name', type: 'string', isOptional: true },
        { name: 'pay_for', type: 'string', isOptional: true },
        { name: 'relatedPerson', type: 'string', isOptional: true },
        { name: 'fee', type: 'number', isOptional: true },
        { name: 'fee_type', type: 'string', isOptional: true },
        { name: 'is_not_add_report', type: 'boolean', isOptional: true },
        { name: 'attachment', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: TRANSACTION_CATEGORY,
      columns: [
        { name: 'category_name', type: 'string' },
        { name: 'category_type', type: 'number' },
        { name: 'transaction_category_parent_id', type: 'string', isOptional: true },
        { name: 'category_description', type: 'string', isOptional: true },
        { name: 'use_count', type: 'number', isOptional: true },
        { name: 'icon_name', type: 'string', isOptional: true },
        { name: 'is_system', type: 'boolean', isOptional: true },
        { name: 'create_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'balances',
      columns: [
        { name: 'transaction_id', type: 'string' },
        { name: 'account_id', type: 'string' },
        { name: 'open_amount', type: 'number' },
        { name: 'movement_amount', type: 'number' },
        { name: 'closing_amount', type: 'boolean' },
        { name: 'transaction_date_at', type: 'boolean' },
      ],
    }),
  ],
});
