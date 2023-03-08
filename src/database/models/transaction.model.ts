import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { TRANSACTIONS } from 'database/constants';

export default class TransactionModel extends Model {
  static table = TRANSACTIONS;

  static associations: Associations = {
    accounts: { type: 'belongs_to', key: 'account_id' },
  };

  @field('amount') amount!: number;
  @field('transactions_typeid') transactionsTypeId!: string;
  @field('transactions_category_id') transactionsCategoryId!: string;
  @text('descriptions') descriptions!: string;
  @date('date_time_at') dateTimeAt!: Date;
  @field('account_id') accountId!: string;
  @field('location') location!: string;
  @text('event_name') eventName!: string;
  @field('pay_for') payFor!: string;
  @field('relatedPerson') relatedPerson!: string;
  @field('fee') fee!: number;
  @field('fee_type') feeType!: string;
  @field('is_not_add_report') isNotAddReport!: boolean;
  @field('attachment') attachment!: string;
  @field('user_id') userId!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
