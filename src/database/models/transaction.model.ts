import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { TRANSACTIONS } from 'database/constants';

export default class TransactionModel extends Model {
  static table = TRANSACTIONS;

  @field('amount') amount!: number;
  @field('toAmount') toAmount!: number;
  @field('transactionType') transactionType!: number;
  @field('categoryId') categoryId!: string;
  @text('descriptions') descriptions!: string;
  @field('accountId') accountId!: string;
  @field('toAccountId') toAccountId!: string;
  @date('dateTimeAt') dateTimeAt!: Date;
  @field('location') location!: string;
  @text('eventName') eventName!: string;
  @field('fee') fee!: number;
  @field('feeType') feeType!: string;
  @field('giver') giver!: string;
  @field('payee') payee!: string;
  @field('relatedPerson') relatedPerson!: string;
  @field('excludeReport') excludeReport!: number;
  @field('attachment') attachment!: string;
  @field('userId') userId!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
