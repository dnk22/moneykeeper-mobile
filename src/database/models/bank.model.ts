import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { BANKS } from 'database/constants';

export default class BankModel extends Model {
  static table = BANKS;

  @field('bankCode') bankCode!: string;
  @text('bankName') bankName!: string;
  @field('shortName') shortName!: boolean;
  @field('icon') icon!: string;
  @field('isSystem') isSystem!: boolean;
  @field('type') type!: string;
}
