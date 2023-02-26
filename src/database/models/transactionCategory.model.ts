import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';
import { TRANSACTION_CATEGORY } from 'database/constants';

export default class TransactionCategory extends Model {
  static table = TRANSACTION_CATEGORY;

  @text('category_name') categoryName!: string;
  @field('category_type') categoryType!: string;
  @field('transaction_category_parent_id') transactionCategoryParentId!: string;
  @text('category_description') categoryDescription!: string;
  @field('use_count') useCount!: number;
  @field('icon_name') iconName!: string;
  @field('is_system') isSystem!: boolean;
  @readonly @date('create_at') createAt!: Date;
}
