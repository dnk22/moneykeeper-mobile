import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { BALANCE } from 'database/constants';

export default class BalanceModel extends Model {
  static table = BALANCE;

  @field('transactionId') transactionId!: string;
  @field('accountId') accountId!: string;
  @field('openAmount') openAmount!: number;
  @field('movementAmount') movementAmount!: number;
  @field('closingAmount') closingAmount!: number;
  @field('transactionDateAt') transactionDateAt!: number;
}