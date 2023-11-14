import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import { CONTACT } from 'database/constants';

export default class ContactModel extends Model {
  static table = CONTACT;
  @text('contactName') contactName!: string;
}
