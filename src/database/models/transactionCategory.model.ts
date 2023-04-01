import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { TRANSACTION_CATEGORY } from 'database/constants';

export default class TransactionCategoryModel extends Model {
  static table = TRANSACTION_CATEGORY;

  @text('category_name') categoryName!: string;
  @field('category_type') categoryType!: number;
  @field('value') value!: string;
  @field('parent_id') parentId!: string;
  @text('description') description!: string;
  @field('icon') icon!: string;
  @field('is_system') isSystem!: boolean;
  @field('use_count') useCount!: number;
  @field('last_use_at') lastUseAt!: Date;
  @readonly @date('create_at') createAt!: Date;
}
