import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { TRANSACTION_CATEGORY } from 'database/constants';

export default class TransactionCategoryModel extends Model {
  static table = TRANSACTION_CATEGORY;

  @text('categoryName') categoryName!: string;
  @field('categoryType') categoryType!: number;
  @field('parentId') parentId!: string;
  @field('dictionaryKey') dictionaryKey!: number;
  @text('description') description!: string;
  @field('icon') icon!: string;
  @field('isSystem') isSystem!: boolean;
  @field('useCount') useCount!: number;
  @field('sortOrder') sortOrder!: number;
  @field('lastUseAt') lastUseAt!: number;
}
