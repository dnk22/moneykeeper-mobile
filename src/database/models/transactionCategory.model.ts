import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { TRANSACTION_CATEGORY } from 'database/constants';

export default class TransactionCategoryModel extends Model {
  static table = TRANSACTION_CATEGORY;

  @text('categoryName') categoryName!: string;
  @field('categoryType') categoryType!: number;
  @field('value') value!: string;
  @field('parentId') parentId!: string;
  @text('description') description!: string;
  @field('icon') icon!: string;
  @field('isSystem') isSystem!: boolean;
  @field('useCount') useCount!: number;
  @field('lastUseAt') lastUseAt!: number;
  @readonly @date('create_at') createAt!: Date;
}
