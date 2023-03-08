import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { BANKS } from 'database/constants';

export default class BankModel extends Model {
  static table = BANKS;

  @field('bank_code') bankCode!: string;
  @text('bank_name') bankName!: string;
  @field('short_name') shortName!: number;
  @field('icon') icon!: number;
  @field('is_system') isSystem!: string;
  @field('is_wallet') isWallet!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
