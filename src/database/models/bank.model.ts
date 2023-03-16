import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { BANKS } from 'database/constants';

export default class BankModel extends Model {
  static table = BANKS;

  @field('bank_code') bankCode!: string;
  @text('bank_name') bankName!: string;
  @field('short_name') shortName!: boolean;
  @field('icon') icon!: string;
  @field('is_system') isSystem!: boolean;
  @field('is_wallet') isWallet!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
