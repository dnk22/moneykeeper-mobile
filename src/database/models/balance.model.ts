import { Model } from '@nozbe/watermelondb';
import { date, field, nochange } from '@nozbe/watermelondb/decorators';
import { BALANCE } from 'database/constants';
export default class BalanceModel extends Model {
  static table = BALANCE;

  @nochange @field('_id') _id!: number;
  @field('transactionId') transactionId!: string;
  @field('accountId') accountId!: string;
  @field('openAmount') openAmount!: number;
  @field('movementAmount') movementAmount!: number;
  @field('closingAmount') closingAmount!: number;
  @date('transactionDateAt') transactionDateAt!: Date;
}
