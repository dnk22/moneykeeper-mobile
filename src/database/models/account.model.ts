import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { ACCOUNTS } from 'database/constants';

export default class AccountModel extends Model {
  static table = ACCOUNTS;

  static associations: Associations = {
    transactions: { type: 'has_many', foreignKey: 'account_id' },
  };

  @text('accountName') accountName!: string;
  @text('accountLogo') accountLogo!: string;
  @field('initial_amount') initialAmount!: number;
  @field('current_amount') currentAmount!: number;
  @field('account_type_id') accountTypeId!: string;
  @field('account_type_name') accountTypeName!: string;
  @field('bank_id') bankId!: string;
  @field('currency') currency!: string;
  @text('descriptions') descriptions!: string;
  @field('is_active') isActive!: boolean;
  @field('is_not_add_report') isNotAddReport!: boolean;
  @field('user_id') userId!: string;
  @field('sort_order') sortOrder!: number;
  @field('term_type') termType!: number;
  @field('term_month') termMonth!: number;
  @field('interest_rate') interestRate!: number;
  @field('interest_payment_type') interestPaymentType!: number;
  @field('due_type') dueType!: number;
  @date('start_date') startDate!: Date;
  @date('end_date') endDate!: Date;
  @field('interest_payment_to_account') interestPaymentToAccount!: string;
  @field('saving_from_account_id') savingFromAccountId!: string;
  @field('number_day_of_year') numberDayOfYear!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  //credit card
  @field('credit_card_limit') creditCardLimit!: number;
  @field('credit_card_is_reminder') creditCardIsReminder!: boolean;
  @field('credit_card_reminder_list') creditCardReminderList!: string;
  @field('credit_card_payment_day') creditCardPaymentDay!: number;
  @field('credit_card_statement_day') creditCardStatementDay!: number;
  @field('credit_card_day_after_statement') creditCardDayAfterStatement!: number;

  @children('transactions') transactions!: any;
}
